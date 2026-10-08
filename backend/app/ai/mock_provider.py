import json
import logging
from backend.app.models import PlanRequest, AdventurePlan
from backend.app.ai.base import BaseGemmaProvider

logger = logging.getLogger("greenquest.ai.mock")


class MockGemmaProvider(BaseGemmaProvider):
    """
    Lightweight development engine simulating Google Gemma-2-2b structured output.
    Used for local development, CI/CD, and offline testing when no Hugging Face
    token is present or no local GPU/Ollama server is active.
    """

    @property
    def provider_name(self) -> str:
        return "Gemma 2 Dev Engine (Offline Fallback)"

    @property
    def model_name(self) -> str:
        return "Gemma-2-2b-it (Local Dev Engine)"

    async def generate_plan(self, request: PlanRequest) -> AdventurePlan:
        logger.info(f"Generating plan with MockGemmaProvider for {request.location} ({request.activity})")

        total = request.duration
        loc = request.location
        act = request.activity.lower()
        level = request.fitness_level.capitalize()
        interests_desc = ", ".join(request.interests) if request.interests else "local wildlife & tranquility"

        # Calculate balanced step breakdown
        warmup_time = max(5, int(total * 0.10))
        cooldown_time = max(5, int(total * 0.10))
        remaining = total - warmup_time - cooldown_time

        if "walk" in act or "hik" in act:
            step2_time = int(remaining * 0.55)
            step3_time = int(remaining * 0.45)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Sensory Arrival & Gentle Stretches",
                    "description": f"Begin at your starting point in {loc}. Take five slow, deep breaths. Stretch calves, ankles, and shoulders while observing the breeze and sky.",
                    "mindfulness_prompt": "Listen closely: Identify three distinct non-human sounds before stepping onto the path."
                },
                {
                    "duration": step2_time,
                    "activity": f"{level} Trail & Path Exploration",
                    "description": f"Walk at an easy, rhythmic pace through {loc}. Keep your eyes off your screen and scan the tree canopy, soil contours, and changes in terrain.",
                    "mindfulness_prompt": "Pocket your phone. Notice the rhythm of your footsteps against the earth."
                },
                {
                    "duration": step3_time,
                    "activity": f"Focused Nature Observation ({interests_desc})",
                    "description": f"Slow your cadence to inspect native flora, bark textures, and bird activity around {loc}. Touch tree bark or collect a fallen leaf.",
                    "mindfulness_prompt": "Look down at a single square foot of ground. How many textures, mosses, or tiny living things can you spot?"
                },
                {
                    "duration": cooldown_time,
                    "activity": "Cooldown & Grounding Reflection",
                    "description": f"Ease your stride into a slow stroll. Rest on a bench, log, or flat rock in {loc}. Hydrate and allow your mind to settle.",
                    "mindfulness_prompt": "Feel the temperature of the air on your skin. Notice how much calmer your mind is without a glowing screen."
                }
            ]
            bring = ["Refillable water bottle", "Sturdy walking/trail shoes", "Light weather-appropriate jacket", "Pocket notebook (optional for nature sketches)"]
            safety = [
                "Stay on marked public paths or neighborhood walkways",
                "Be aware of uneven roots, gravel, and traffic crossings",
                "Drink water regularly, especially if warm or humid"
            ]
            motto = "Two feet on the ground beats two thumbs on the screen."

        elif "run" in act or "jog" in act:
            step2_time = int(remaining * 0.65)
            step3_time = int(remaining * 0.35)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Dynamic Mobility & Breathing Cadence",
                    "description": f"Perform high knees, leg swings, and ankle circles near {loc}. Establish a comfortable diaphragmatic breathing rhythm.",
                    "mindfulness_prompt": "Feel your lungs expand with real outdoor oxygen—no digital audio needed."
                },
                {
                    "duration": step2_time,
                    "activity": f"Outdoor Run ({level} Pace)",
                    "description": f"Run through scenic stretches of {loc}. Focus on steady stride cadence, relaxed posture, and taking in the panoramic landscape.",
                    "mindfulness_prompt": "Match your breath to your footsteps: 3 strides in, 3 strides out."
                },
                {
                    "duration": step3_time,
                    "activity": "Interval Bursts or Hill Strides",
                    "description": f"Incorporate gentle speed surges or incline strides around {loc} according to your comfort level.",
                    "mindfulness_prompt": "Notice the rush of natural endorphins and how alive your senses feel."
                },
                {
                    "duration": cooldown_time,
                    "activity": "Walk & Hamstring/Calf Recovery",
                    "description": f"Walk slowly for the final minutes in {loc}. Gently stretch hamstrings, quadriceps, and hip flexors while hydrating.",
                    "mindfulness_prompt": "Place both hands on your chest and feel your strong, natural heartbeat slowing down."
                }
            ]
            bring = ["Running shoes", "Electrolyte or water flask", "Breathable running apparel", "UV protection / visor"]
            safety = [
                "Scan path 10 feet ahead for roots, loose pebbles, or wet patches",
                "Keep headphone volume zero or off to remain fully aware of ambient surroundings",
                "Warm up thoroughly before increasing pace"
            ]
            motto = "Run through trees, not through social feeds."

        elif "cycle" in act or "bike" in act:
            step2_time = int(remaining * 0.60)
            step3_time = int(remaining * 0.40)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Pre-Ride ABC Check & Easy Pedal",
                    "description": f"Inspect Air, Brakes, and Chain on your bike. Begin pedaling at a low gear through {loc} to loosen joints.",
                    "mindfulness_prompt": "Feel the breeze directly on your face and forehead as your wheels start rolling."
                },
                {
                    "duration": step2_time,
                    "activity": f"Panoramic Cycling Loop ({level})",
                    "description": f"Ride along cycling corridors or park perimeters in {loc}. Maintain an upright, alert posture and enjoy the moving scenery.",
                    "mindfulness_prompt": "No handlebar phone mount distractions. Keep your gaze up and take in the horizon."
                },
                {
                    "duration": step3_time,
                    "activity": "Scenic Lookout & Flora Pause",
                    "description": f"Dismount at a scenic vantage point in {loc}. Take a few minutes to walk your bicycle and inspect surrounding green spaces.",
                    "mindfulness_prompt": "Notice how rapidly cycling connects different micro-climates and scent pockets of vegetation."
                },
                {
                    "duration": cooldown_time,
                    "activity": "Gentle Spin & Spin-down Stretch",
                    "description": f"Cycle in a high cadence, low resistance gear back to base. Stretch your lower back, neck, and calves.",
                    "mindfulness_prompt": "Acknowledge the physical accomplishment of moving by human power alone."
                }
            ]
            bring = ["Fitted cycling helmet", "Water cage flask", "Bike bell/light", "Small multi-tool or puncture patch kit"]
            safety = [
                "Always wear a properly fastened bicycle helmet",
                "Use hand signals and yield to pedestrians at all crosswalks",
                "Watch out for gravel, storm drains, and vehicle blind spots"
            ]
            motto = "Life is like riding a bicycle: look ahead, not down at a glass rectangle."

        elif "garden" in act or "plant" in act:
            step2_time = int(remaining * 0.50)
            step3_time = int(remaining * 0.50)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Plot Survey & Soil Inspection",
                    "description": f"Walk your garden beds, balcony containers, or community allotment in {loc}. Check soil moisture with your fingers and spot new shoots.",
                    "mindfulness_prompt": "Squeeze a pinch of soil in your palm. Inhale the earthy aroma of geosmin."
                },
                {
                    "duration": step2_time,
                    "activity": f"Cultivation, Weeding & Pruning ({level})",
                    "description": f"Gently pull invasive weeds by their roots, prune yellowing foliage, and aerate topsoil around plants in {loc}.",
                    "mindfulness_prompt": "Feel the tactile grit of earth on your hands—nature's ultimate grounding experience."
                },
                {
                    "duration": step3_time,
                    "activity": f"Plant Nurturing & Watering ({interests_desc})",
                    "description": f"Water thirsty roots with a fine spray rose, mulch vulnerable root zones, and stake or trellis climbing varieties in {loc}.",
                    "mindfulness_prompt": "Watch water soak deeply into the soil. Observe which beneficial pollinators are visiting."
                },
                {
                    "duration": cooldown_time,
                    "activity": "Hand Wash, Tool Care & Garden Contemplation",
                    "description": f"Clean your trowels and shears. Sit back quietly and admire your handiwork in {loc}.",
                    "mindfulness_prompt": "Reflect on how gardens grow with patience, the opposite of instant online notifications."
                }
            ]
            bring = ["Garden trowel or gloves", "Watering can or hose", "Pruning snips", "Sun hat"]
            safety = [
                "Lift bags and pots with your knees, not your back",
                "Wash hands thoroughly after handling soil or organic fertilizers",
                "Wear garden gloves to protect against thorns and sharp rocks"
            ]
            motto = "Touch soil, plant seeds, cultivate peace."

        elif "bird" in act:
            step2_time = int(remaining * 0.50)
            step3_time = int(remaining * 0.50)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Acoustic Tuning & Territory Mapping",
                    "description": f"Stand still near trees or water features in {loc}. Close your eyes for 3 minutes to map bird calls around you.",
                    "mindfulness_prompt": "How many distinct vocalizations can you isolate in a 360-degree radius?"
                },
                {
                    "duration": step2_time,
                    "activity": f"Slow Canopy Stalk & Perch Scouting ({level})",
                    "description": f"Walk with soft, deliberate footsteps through {loc}. Look for branch tremors, feeding behavior, and silhouette movements in the foliage.",
                    "mindfulness_prompt": "Instead of snapping an instant phone photo, mentally memorize the wing pattern and beak shape."
                },
                {
                    "duration": step3_time,
                    "activity": f"Perched Bird Observation ({interests_desc})",
                    "description": f"Find a partially concealed vantage point in {loc}. Watch feeding, preening, or territorial displays without disturbing the birds.",
                    "mindfulness_prompt": "Patience is your superpower here. Let wildlife become accustomed to your quiet presence."
                },
                {
                    "duration": cooldown_time,
                    "activity": "Nature Scribe & Field Debrief",
                    "description": f"Jot down species descriptions or sketches in a paper notebook. Walk back leisurely through {loc}.",
                    "mindfulness_prompt": "Notice how sharpening your vision for small birds makes the whole world feel richer."
                }
            ]
            bring = ["Binoculars (if available)", "Small paper notebook and pencil", "Quiet non-rustling clothing", "Water bottle"]
            safety = [
                "Maintain a respectful distance from nesting sites and fledglings",
                "Watch your footing while looking up at treetops",
                "Avoid using aggressive bird call playback apps that stress wildlife"
            ]
            motto = "Listen to birdsong in real time, not through headphones."

        else: # Nature exploration / general outdoor quest
            step2_time = int(remaining * 0.50)
            step3_time = int(remaining * 0.50)
            steps_data = [
                {
                    "duration": warmup_time,
                    "activity": "Sensory Orientation & Breath Calibration",
                    "description": f"Stand in an open space in {loc}. Feel the wind direction on your cheeks, notice ambient sunlight or cloud cover, and calibrate your senses.",
                    "mindfulness_prompt": "Take three diaphragmatic breaths. Let go of all digital urgency."
                },
                {
                    "duration": step2_time,
                    "activity": f"Micro-Ecosystem Discovery Trail ({level})",
                    "description": f"Navigate paths and open clearings in {loc}. Look closely for animal tracks, lichen patterns on rocks, and native tree leaves.",
                    "mindfulness_prompt": "Run your fingers along a patch of moss or smooth stone. Notice the temperature and texture."
                },
                {
                    "duration": step3_time,
                    "activity": f"Curiosity Pause & Botanical Focus ({interests_desc})",
                    "description": f"Stop near a grove, pond, or garden in {loc}. Examine the underside of leaves and observe insect pollinators.",
                    "mindfulness_prompt": "Can you find a plant species in this area you have never paid attention to before?"
                },
                {
                    "duration": cooldown_time,
                    "activity": "Quiet Grounding & Transition",
                    "description": f"Find a spot to sit on grass or earth in {loc}. Rest your hands in your lap and absorb the quiet atmosphere.",
                    "mindfulness_prompt": "Thank yourself for choosing living green earth over endless pixel feeds."
                }
            ]
            bring = ["Water bottle", "Comfortable walking shoes", "Magnifying glass or loupe (optional)", "Hat/Sunscreen"]
            safety = [
                "Stay mindful of weather shifts and local daylight hours",
                "Respect wildlife and leave plants and habitats undisturbed",
                "Watch your step on damp logs or slippery stones"
            ]
            motto = "Touch grass, breathe deep, remember what real life feels like."

        payload = {
            "title": f"The {loc} {request.activity.title()} Quest",
            "duration": total,
            "activity": request.activity,
            "difficulty": level,
            "steps": steps_data,
            "things_to_bring": bring,
            "safety_tips": safety,
            "offline_tip": "Keep your phone safely zipped in your pocket or backpack. Let the sunlight and fresh air be your sole interface.",
            "touch_grass_motto": motto
        }

        # Parse using the robust base parser to ensure 100% schema consistency
        return self.parse_and_validate_json(json.dumps(payload), request)
