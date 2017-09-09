from py_data.data.ParseData import ParseData


def main():
    data = ParseData()
    data.refresh_monster_materials()
    data.refresh_monster_names()

if __name__ == '__main__':
    main()
