import json
import urllib.request

SB_URL = "https://cfweezdrlsjzrfrafayi.supabase.co"
SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd2VlemRybHNqenJmcmFmYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDQ3OTIsImV4cCI6MjA4NzM4MDc5Mn0.GSRpmfO40EGlBWEuZKgkxT4NjhlPLLIYDmArSVtQSdw"
SB_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd2VlemRybHNqenJmcmFmYXlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTgwNDc5MiwiZXhwIjoyMDg3MzgwNzkyfQ.rMosPPZjMj71ufiLIAm7QcEbdK96Yg42lmjCcML42mw"

def post(table, data):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        f"{SB_URL}/rest/v1/{table}",
        data=body,
        headers={
            "apikey": SB_KEY,
            "Authorization": f"Bearer {SB_SECRET}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method="POST",
    )
    try:
        resp = urllib.request.urlopen(req)
        print(f"  {table}: OK ({resp.status})")
    except urllib.error.HTTPError as e:
        print(f"  {table}: ERREUR {e.code} — {e.read().decode()}")

services = [
    {"num": "01", "title": "Coupe & Coiffage", "description": "Coupes sur-mesure, adapt\u00e9es \u00e0 votre morphologie et votre style de vie.", "price": "\u00c0 partir de 35\u20ac", "tags": ["Coupe femme", "Coupe homme", "Brushing"], "icon_name": "scissors", "featured": True, "sort_order": 1},
    {"num": "02", "title": "Coloration", "description": "Techniques de pointe \u2014 balayage, ombr\u00e9, couleur compl\u00e8te \u2014 avec des produits respectueux.", "price": "\u00c0 partir de 55\u20ac", "tags": ["Balayage", "M\u00e8ches", "Patine"], "icon_name": "brush", "featured": False, "sort_order": 2},
    {"num": "03", "title": "Soins Capillaires", "description": "Rituels de soins profonds pour nourrir, r\u00e9parer et sublimer votre chevelure.", "price": "\u00c0 partir de 25\u20ac", "tags": ["K\u00e9ratine", "Botox capillaire", "Masque"], "icon_name": "sparkle", "featured": False, "sort_order": 3},
    {"num": "04", "title": "C\u00e9r\u00e9monies", "description": "Coiffures \u00e9v\u00e9nementielles pour mariages, galas et moments d\u2019exception.", "price": "Sur devis", "tags": ["Mariage", "Chignon", "Tresses"], "icon_name": "leaf", "featured": True, "sort_order": 4},
]

testimonials = [
    {"name": "Camille L.", "text": "Un salon magnifique avec une ambiance incroyable. Le r\u00e9sultat est toujours au-del\u00e0 de mes attentes. Je recommande les yeux ferm\u00e9s !", "rating": 5, "sort_order": 1},
    {"name": "Sophie M.", "text": "La d\u00e9co est sublime et l\u2019accueil chaleureux. Mon balayage est exactement ce que je voulais. Merci pour ce moment de d\u00e9tente.", "rating": 5, "sort_order": 2},
    {"name": "Juliette R.", "text": "Enfin un salon qui prend le temps d\u2019\u00e9couter ! Les soins sont exceptionnels et l\u2019espace est pens\u00e9 dans les moindres d\u00e9tails.", "rating": 5, "sort_order": 3},
    {"name": "Marie D.", "text": "Une exp\u00e9rience unique \u00e0 chaque visite. L\u2019\u00e9quipe est aux petits soins et le cadre est absolument magnifique. Mon salon coup de c\u0153ur !", "rating": 5, "sort_order": 4},
    {"name": "Laura B.", "text": "Le meilleur salon de la r\u00e9gion, sans h\u00e9sitation. Professionnalisme, \u00e9coute et r\u00e9sultat parfait. Je ne changerais pour rien au monde.", "rating": 5, "sort_order": 5},
]

print("Insertion des donnees...")
post("services", services)
post("testimonials", testimonials)
print("Termine !")
