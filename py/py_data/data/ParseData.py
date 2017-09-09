from py_data.data import GetData
from py_data.constants import constants
import json
from py_data.DAO import MonsterDAO, MonsterNameDAO

class ParseData(object):
    def __init__(self):
        get_data = GetData.GetData()
        self.list_monsters = get_data.get_monsters()
        self.list_evolution_materials = get_data.get_evolution_materials()
        self.monsterDAO = MonsterDAO.MonsterDAO()
        self.monsterNameDAO = MonsterNameDAO.MonsterNameDAO()

    def get_us_only_monster(self):
        us_only_monsters = [monster["id"] for monster in self.list_monsters if monster['jp_only'] is False]
        return us_only_monsters

    def has_evo_materials(self, evolves_to_id):

        for monster_id, evo_stages in self.list_evolution_materials.items():
            for stage in evo_stages:
                if stage[constants.evo_to] == int(evolves_to_id):
                    return True
        return False

    def make_evolution_tree(self, evolves_to_id):
        evo_tree = {
            "id": evolves_to_id,
            "materials": {}
        }
        print(evolves_to_id)

        if evolves_to_id == 2978 or evolves_to_id == 2926:
            return evo_tree

        for monster_id, evo_stages in self.list_evolution_materials.items():

            found = False

            for stage in evo_stages:
                if stage[constants.evo_to] == evolves_to_id and \
                                stage[constants.materials] != constants.de_evolution_materials :

                    for material in stage[constants.materials]:
                        material_id = str(material[0])
                        material_count = material[1]

                        if self.has_evo_materials(material_id):
                            evo_tree[constants.materials][material_id] = self.make_evolution_tree(int(material_id))
                        else:
                            if material_id not in evo_tree[constants.materials]:
                                evo_tree[constants.materials][material_id] = material_count
                            else:
                                evo_tree[constants.materials][material_id] += material_count
                    found = True

            if found is True:
                evo_tree["evolves_from"] = self.make_evolution_tree(int(monster_id))

        return evo_tree

    def refresh_monster_materials(self):
        us_only_monster = self.get_us_only_monster()
        self.monsterDAO.delete_all_monsters()

        for monster_id in us_only_monster:
            evo_tree = self.make_evolution_tree(monster_id)
            self.monsterDAO.insert_monsters(evo_tree)

    def refresh_monster_names(self):
        for monster in self.list_monsters:
            new_item = {
                "name" : monster["name"],
                "_id" : monster["id"]
            }

            self.monsterNameDAO.insert_monsters(new_item)

