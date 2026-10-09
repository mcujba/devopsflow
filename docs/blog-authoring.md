# Cum adaugi un articol pe blog

Un articol este un fișier `.mdx` în `src/content/blog/`. Nu există panou de administrare: adaugi fișierul, faci commit și deploy.

## 1. Numele fișierului

`{slug}.{limbă}.mdx`, de exemplu:

```
src/content/blog/terraform-state-locking.en.mdx
src/content/blog/terraform-state-locking.ro.mdx
src/content/blog/terraform-state-locking.ru.mdx
```

- `slug` devine adresa: `/blog/terraform-state-locking`. Folosește litere mici, cifre și cratime.
- Folosește același `slug` pentru toate limbile aceluiași articol; așa se leagă între ele versiunile (hreflang).
- Poți publica doar într-o limbă. Articolul apare numai în acea limbă, iar sitemap-ul și hreflang-ul țin cont de asta automat.

## 2. Antetul fișierului

```mdx
---
title: "Terraform State Locking, Explained"
description: "O frază care apare în listă, în Google și la distribuire. 120–160 de caractere."
date: "2026-10-20"
tags: ["terraform", "aws"]
locale: "en"
author: "Maxim Cujba"
---

Textul articolului începe aici.
```

- `date` în format `AAAA-LL-ZZ`. Articolele se ordonează după dată, cele mai noi primele.
- `locale` trebuie să fie aceeași limbă ca în numele fișierului.
- `tags`: 1–4 etichete scurte.

## 3. Conținutul

Markdown obișnuit. Titlul articolului vine din antet, deci în text începe cu `##`. Blocurile de cod se evidențiază automat:

````md
```bash
terraform init -backend-config=prod.hcl
```
````

## 4. Verifică local

```bash
npm run dev
```

Deschide `http://localhost:3000/blog` (sau `/ro/blog`, `/ru/blog`) și articolul. Apoi rulează `npm test`: testele de sitemap verifică și articolele.

## 5. Unde apare

- pe `/blog`, în limba lui;
- pe prima pagină, în modulul „Ultimele articole” (cele mai noi trei);
- în `sitemap.xml`, cu data din antet.

## Pentru trafic

- Scrie titlul ca pe o căutare reală („How to…”, „X vs Y”, un mesaj de eroare exact).
- Leagă articolul de pagina de serviciu potrivită, de exemplu `[Kubernetes](/services/kubernetes)`.
- Un articol bun în engleză, tradus apoi în română și rusă, aduce mai mult decât trei articole scurte.
