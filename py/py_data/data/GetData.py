import requests
from py_data.constants import constants


class GetData(object):
    """
    GetData gets JSON and makes it into a Dic then returns it to the user
    - gets data from Pad herder API
    """
    def __init__(self):
        self.list_monsters_url = constants.list_of_monsters_url
        self.list_materials_url = constants.list_of_evo_materials_url

    @staticmethod
    def _get(from_this_url):
        response = requests.get(from_this_url).json()
        return response

    def get_monsters(self):
        monsters = self._get(self.list_monsters_url)
        return monsters

    def get_evolution_materials(self):
        evolutions = self._get(self.list_materials_url)
        return evolutions
