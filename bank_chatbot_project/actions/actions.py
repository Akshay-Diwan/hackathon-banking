# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionSetLanguageSlot(Action):
    """Custom action to set language slot based on metadata from Flask app"""

    def name(self) -> Text:
        return "action_set_language_slot"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get language from metadata sent by Flask app
        metadata = tracker.latest_message.get('metadata', {})
        detected_language = metadata.get('language', 'en')
        
        # Map language codes if needed
        language_mapping = {
            'hi': 'hi',
            'mr': 'mr', 
            'gu': 'gu',
            'en': 'en'
        }
        
        mapped_language = language_mapping.get(detected_language, 'en')
        
        # Set the language slot
        return [SlotSet("language", mapped_language)]