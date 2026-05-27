# PersonaAI — Génération de personas clients par IA comportementale

> Des personas construits depuis les données réelles, pas les intuitions de l'équipe marketing.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-orange?style=flat)](https://scikit-learn.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)

---

## Vue d'ensemble

PersonaAI génère des personas clients data-driven en combinant clustering comportemental (K-Means sur les patterns d'usage), filtrage collaboratif pour les recommandations (LightFM), et génération de narratives persona via LLM. Les équipes Marketing et Produit disposent de segments précis et actionnables basés sur des données réelles.

**Domaine :** Product Analytics / Customer Segmentation  
**Port VM :** 3017 | **Sous-domaine :** personaai.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts | Galerie personas, analyse segments |
| Backend | FastAPI (Python 3.11), Uvicorn | API segmentation, personas, recommendations |
| Clustering | scikit-learn (K-Means, DBSCAN) | Segmentation comportementale |
| Recommandations | LightFM (WARP) | Filtrage collaboratif hybride |
| LLM | Groq (llama-3.1-70b-versatile) | Génération narrative persona |
| Réduction dim | UMAP | Visualisation clusters 2D |
| Base de données | PostgreSQL 16 | Segments, personas, events |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3017) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
scikit-learn==1.4.2
lightfm==1.17
umap-learn==0.5.6
groq==0.9.0
pandas==2.2.2
numpy==1.26.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
matplotlib==3.9.0
```

---

## Architecture mono-repo

```
personaai/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Galerie personas + métriques
│   │   ├── personas/[id]/        # Profil persona détaillé
│   │   ├── segments/             # Vue clustering UMAP 2D
│   │   └── recommendations/      # Reco produit par persona
│   └── src/components/
│       ├── PersonaCard.tsx       # Carte persona avec avatar + traits
│       ├── ClusterScatter.tsx    # Scatter UMAP 2D interactif
│       ├── BehaviorRadar.tsx     # Radar chart 6 dimensions
│       ├── SegmentDistribution.tsx # % clients par persona
│       └── RecoGrid.tsx          # Top recommendations par persona
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── personas.py       # CRUD + generate personas
│   │   │   ├── segments.py       # Clustering + UMAP viz
│   │   │   └── recommendations.py # LightFM recos par persona
│   │   ├── services/
│   │   │   ├── clustering.py     # K-Means + optimal K (elbow)
│   │   │   ├── persona_writer.py # Groq LLM narrative persona
│   │   │   ├── lightfm_engine.py # Filtrage collaboratif
│   │   │   └── umap_reducer.py   # UMAP 2D projection
│   │   └── models/
│   │       ├── persona.py
│   │       └── segment.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'primaryBorderColor': '#b45309', 'lineColor': '#374151', 'secondaryColor': '#fef3c7'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3017)"]
        NEXT["Next.js 14\nPersona Dashboard"]
        API["FastAPI"]

        subgraph ML["🧬 Segmentation Pipeline"]
            CLUSTER["K-Means + DBSCAN\nBehavioral clustering"]
            UMAP["UMAP\n2D projection"]
            LIGHTFM["LightFM WARP\nCollaborative filtering"]
            GROQ["Groq LLM\nPersona narrative"]
        end

        PG[("PostgreSQL\nSegments + Personas")]
    end

    EVENTS["Behavioral Events\nProduct analytics"] --> CLUSTER
    CLUSTER --> UMAP
    CLUSTER --> LIGHTFM
    CLUSTER --> GROQ
```

### Séquence — Génération d'un persona

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant PM as Product Manager
    participant API as FastAPI
    participant CLUSTER as K-Means
    participant UMAP as UMAP
    participant GROQ as Groq LLM
    participant LFM as LightFM

    PM->>API: POST /segments/compute {n_clusters: 5, features: ["session_frequency", "feature_usage", "payment_tier"]}

    API->>CLUSTER: fit(user_behavior_matrix, k=5)
    CLUSTER-->>API: labels=[0,2,1,0,3,...], inertia, silhouette=0.67

    API->>UMAP: transform(behavior_matrix)
    UMAP-->>API: coords_2d=[{x: 2.3, y: -1.4, cluster: 0}, ...]

    loop pour chaque cluster (k=5)
        API->>API: compute_centroid_profile(cluster_i)
        Note over API: Moyenne features: freq=4.2/sem, usage=0.72, tier=pro
        API->>GROQ: generate_persona_narrative(profile)
        GROQ-->>API: "Sophie, 32 ans, Product Manager dans une PME tech. Elle utilise la plateforme 4x/semaine..."
    end

    API->>LFM: train(user_item_interactions)
    LFM-->>API: model_ready

    API-->>PM: {personas: 5, silhouette: 0.67, largest_segment: "Sophie (38%)"}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    PERSONA {
        uuid id PK
        string name
        string avatar_url
        text narrative
        jsonb behavior_profile
        jsonb demographic_profile
        float[] centroid
        int customer_count
        float pct_of_base
        timestamp generated_at
    }
    SEGMENT_RUN {
        uuid id PK
        int n_clusters
        float silhouette_score
        string algorithm
        jsonb umap_coords
        timestamp run_at
    }
    BEHAVIOR_FEATURE {
        uuid id PK
        string name
        string description
        float weight_in_clustering
    }
    RECOMMENDATION {
        uuid id PK
        uuid persona_id FK
        string item_id
        string item_name
        float score
        string explanation
    }

    PERSONA }o--|| SEGMENT_RUN : "generated_by"
    PERSONA ||--o{ RECOMMENDATION : "gets"
```

---

## PRD

### Problème
Les personas marketing sont généralement créés par intuition ou par quelques interviews. Ils ne représentent pas réellement les segments comportementaux de la base client. Les décisions produit ne sont pas alignées avec les vrais patterns d'usage.

### Solution
PersonaAI segmente automatiquement les utilisateurs basé sur leurs comportements réels (fréquence, features utilisées, parcours), génère un portrait narratif pour chaque segment via LLM, et fournit les recommandations personnalisées par persona.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Product Manager | Comprendre les vrais segments d'usage pour prioriser les features |
| CMO | Segmentation précise pour des campagnes marketing ciblées |
| Data Analyst | Valider et affiner les clusters comportementaux |

### OKRs
- Silhouette score clustering > 0.60 (segments distincts)
- Réduction variance intra-cluster vs baseline > 30%
- Taux d'adoption par les PMs : > 80% utilisent PersonaAI pour la roadmap

---

## User Stories

```
US-01 [PM] En tant que Product Manager,
      je veux lancer une segmentation sur les 3 derniers mois d'usage
      et obtenir 5 personas distincts
      afin de présenter les vrais segments à mon équipe.

US-02 [PM] En tant que PM,
      je veux voir le portrait narratif de chaque persona
      ("Sophie utilise la plateforme 4x/semaine pour ses rapports...")
      afin de rendre les données compréhensibles par tous.

US-03 [CMO] En tant que CMO,
      je veux savoir quelle fonctionnalité est la plus utilisée par chaque persona
      afin d'adapter le message marketing de chaque campagne.

US-04 [Data Analyst] En tant qu'analyste,
      je veux visualiser les clusters dans un espace 2D (UMAP)
      et voir si les segments sont bien séparés
      afin de valider la qualité de la segmentation.

US-05 [PM] En tant que PM,
      je veux voir les recommandations de features par persona
      (basées sur le filtrage collaboratif)
      afin de prioriser les développements selon les besoins réels.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Optimal K | Méthode du coude (elbow) pour K optimal (3-8) | ✅ Elbow chart |
| R2 | Silhouette | Score > 0.50 pour valider la segmentation | ✅ Quality badge |
| R3 | Features | session_frequency, feature_usage, payment_tier, support_tickets, onboarding_completion | ✅ Feature selector |
| R4 | UMAP viz | 2D projection des clusters pour exploration visuelle | ✅ Scatter plot |
| R5 | Narrative LLM | Persona = nom + âge + role + comportement + besoins | ✅ Persona card |
| R6 | Reco collaboratif | LightFM WARP sur interactions user × feature | ✅ Reco grid |
| R7 | Stabilité | Re-segmentation mensuelle, suivi migrations entre clusters | ✅ Migration heatmap |
| R8 | Taille minimale | Cluster < 5% base → fusionné avec le plus proche | ✅ Merge rule |
| R9 | Anonymisation | Clusters sans données individuelles identifiables | ✅ Privacy mode |
| R10 | Export | Export CSV segment + persona cards PDF | ✅ Export button |

---

## Spécification API

**Base URL :** `http://personaai.wikolabs.com/api/v1`

### POST /segments/compute
```json
{"n_clusters": 5, "features": ["session_frequency", "feature_usage_score", "payment_tier"], "date_range": "last_90_days"}
// Response: {"run_id": "r_xyz", "silhouette": 0.67, "personas": [{"id": "p1", "name": "Sophie", "size_pct": 0.38}]}
```

### GET /personas/{id}
```json
// Response: {"name": "Sophie", "narrative": "Sophie est Product Manager...", "top_features_used": ["reports", "dashboard"], "avg_session_frequency": 4.2, "recommendations": [...]}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Persona Gallery** | Grille de cartes personas avec avatar, nom, % base, trait clé |
| **UMAP Scatter** | Scatter plot 2D interactif, couleur par cluster, hover = profil |
| **Behavior Radar** | Radar 6 dimensions par persona |
| **Recommendation Grid** | Top 5 features recommandées par persona (LightFM) |
| **Segment Distribution** | Pie chart : % de la base par persona |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: personaai, POSTGRES_USER: pa_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://pa_user:${POSTGRES_PASSWORD}@postgres/personaai
      GROQ_API_KEY: "${GROQ_API_KEY}"
    depends_on: [postgres]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3017:80"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] K-Means clustering comportemental
- [ ] UMAP 2D visualization
- [ ] Persona narrative (Groq)

### Phase 2 — Intelligence
- [ ] LightFM recommendations
- [ ] Elbow optimal K
- [ ] Migration tracking entre segments

### Phase 3 — Enterprise
- [ ] Intégration product analytics (Amplitude, Mixpanel)
- [ ] Auto-segmentation par cohorte
- [ ] A/B testing par persona

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
