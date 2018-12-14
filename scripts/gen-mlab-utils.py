import csv
import json

def main():
    site_to_cc = {}
    with open('mlab-sites-list.csv') as in_file:
        csv_reader = csv.reader(in_file)
        next(csv_reader)
        for row in csv_reader:
            site = row[0].lower()
            cc = row[3]
            if site in site_to_cc:
                raise Exception("dupe")
            site_to_cc[site] = cc
    print(json.dumps(site_to_cc, indent=2))

if __name__ == "__main__":
    main()
