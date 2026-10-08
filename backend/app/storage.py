import sqlite3
import json
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from backend.app.config import settings
from backend.app.models import AdventurePlan, StatsResponse


class PlanStorage:
    """Persistent SQLite repository for GreenQuest outdoor plans and activity logs."""

    def __init__(self, db_path: str = None):
        raw_path = db_path or settings.DATABASE_PATH
        self._mem_conn = None

        if str(raw_path) == ":memory:":
            self.db_path = Path(":memory:")
            self._mem_conn = sqlite3.connect(":memory:", check_same_thread=False)
            self._mem_conn.row_factory = sqlite3.Row
        else:
            self.db_path = Path(raw_path)
            self.db_path.parent.mkdir(parents=True, exist_ok=True)

        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        if self._mem_conn is not None:
            return self._mem_conn
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        conn = self._get_connection()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS plans (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                location TEXT NOT NULL,
                duration INTEGER NOT NULL,
                activity TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                data_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                completed_at TEXT,
                completion_reflection TEXT,
                rating INTEGER,
                model_used TEXT NOT NULL
            )
        """)
        conn.commit()
        if self._mem_conn is None:
            conn.close()

    def save_plan(self, plan: AdventurePlan) -> AdventurePlan:
        conn = self._get_connection()
        conn.execute(
            """
            INSERT OR REPLACE INTO plans (
                id, title, location, duration, activity, difficulty,
                data_json, created_at, completed, completed_at,
                completion_reflection, rating, model_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                plan.id,
                plan.title,
                plan.location,
                plan.duration,
                plan.activity,
                plan.difficulty,
                plan.model_dump_json(),
                plan.created_at,
                1 if plan.completed else 0,
                plan.completed_at,
                plan.completion_reflection,
                plan.rating,
                plan.model_used,
            ),
        )
        conn.commit()
        if self._mem_conn is None:
            conn.close()
        return plan

    def get_plan(self, plan_id: str) -> Optional[AdventurePlan]:
        conn = self._get_connection()
        cursor = conn.execute(
            "SELECT data_json, completed, completed_at, completion_reflection, rating FROM plans WHERE id = ?",
            (plan_id,),
        )
        row = cursor.fetchone()
        if not row:
            if self._mem_conn is None:
                conn.close()
            return None

        plan_dict = json.loads(row["data_json"])
        plan_dict["completed"] = bool(row["completed"])
        plan_dict["completed_at"] = row["completed_at"]
        plan_dict["completion_reflection"] = row["completion_reflection"]
        plan_dict["rating"] = row["rating"]
        if self._mem_conn is None:
            conn.close()
        return AdventurePlan(**plan_dict)

    def list_plans(self, limit: int = 50) -> List[AdventurePlan]:
        conn = self._get_connection()
        cursor = conn.execute(
            "SELECT data_json, completed, completed_at, completion_reflection, rating FROM plans ORDER BY created_at DESC LIMIT ?",
            (limit,),
        )
        rows = cursor.fetchall()
        results = []
        for row in rows:
            plan_dict = json.loads(row["data_json"])
            plan_dict["completed"] = bool(row["completed"])
            plan_dict["completed_at"] = row["completed_at"]
            plan_dict["completion_reflection"] = row["completion_reflection"]
            plan_dict["rating"] = row["rating"]
            results.append(AdventurePlan(**plan_dict))
        if self._mem_conn is None:
            conn.close()
        return results

    def mark_completed(
        self, plan_id: str, reflection: Optional[str] = None, rating: Optional[int] = None
    ) -> Optional[AdventurePlan]:
        plan = self.get_plan(plan_id)
        if not plan:
            return None

        plan.completed = True
        plan.completed_at = datetime.utcnow().isoformat()
        if reflection is not None:
            plan.completion_reflection = reflection
        if rating is not None:
            plan.rating = rating

        conn = self._get_connection()
        conn.execute(
            """
            UPDATE plans
            SET completed = 1,
                completed_at = ?,
                completion_reflection = ?,
                rating = ?,
                data_json = ?
            WHERE id = ?
            """,
            (
                plan.completed_at,
                plan.completion_reflection,
                plan.rating,
                plan.model_dump_json(),
                plan_id,
            ),
        )
        conn.commit()
        if self._mem_conn is None:
            conn.close()

        return plan

    def get_stats(self) -> StatsResponse:
        conn = self._get_connection()
        cursor = conn.execute("SELECT COUNT(*) FROM plans")
        total_plans = cursor.fetchone()[0]

        cursor = conn.execute("SELECT COUNT(*), COALESCE(SUM(duration), 0) FROM plans WHERE completed = 1")
        row = cursor.fetchone()
        completed_plans = row[0]
        total_minutes = row[1]

        cursor = conn.execute("SELECT activity, COUNT(*) FROM plans GROUP BY activity")
        activity_breakdown = {r[0]: r[1] for r in cursor.fetchall()}

        if self._mem_conn is None:
            conn.close()

        hours = round(total_minutes / 60.0, 1)
        grass_score = int(total_minutes * 10 + completed_plans * 50)

        return StatsResponse(
            total_plans=total_plans,
            completed_plans=completed_plans,
            total_minutes_outside=total_minutes,
            screen_free_hours_gained=hours,
            grass_touched_score=grass_score,
            activity_breakdown=activity_breakdown,
        )


# Global storage instance
storage = PlanStorage()
