from pymongo import MongoClient


class MonsterNameDAO(object):
    def __init__(self):
        client = MongoClient("mongodb://brandon:332746@ds161162.mlab.com:61162/padevo_python")
        self.db = client['padevo_python']
        self.monster_collection = self.db.monsterNames

    def insert_monsters(self, monster):
        self.monster_collection.insert_one(monster)

    def delete_all_monsters(self):
        self.monster_collection.remove({})
