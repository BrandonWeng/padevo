from py_data.data import GetData
from py_data.constants import constants

class ParseData(object):
    def __init__(self, list_monsters, list_evolution_materials):
        self.list_monsters = list_monsters
        self.list_evolution_materials = list_evolution_materials

    def get_us_only_monster(self):
        us_only_monsters = [monster for monster in self.list_monsters if monster['jp_only'] is False]
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

        for monster_id, evo_stages in self.list_evolution_materials.items():
            for stage in evo_stages:
                if stage[constants.evo_to] == evolves_to_id and \
                                stage[constants.materials] != constants.de_evolution_materials:

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

        return evo_tree


get_data = GetData.GetData()
monsters = get_data.get_monsters()
evolution_materials = get_data.get_evolution_materials()

parse_data = ParseData(monsters, evolution_materials)
us_only_monster = parse_data.get_us_only_monster()
print(parse_data.make_evolution_tree(2076))
