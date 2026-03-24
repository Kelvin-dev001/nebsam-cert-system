# Certificate Image Assets

Place the following image files in this directory (`frontend/public/assets/`).
These images are referenced by the certificate PDF generator and HTML preview.

| Filename | Description | Required? |
|---|---|---|
| `signature.png` | Handwritten authorized installer signature (Dennis Karani). Transparent background preferred. | **Required** |
| `kebs-badge.png` | KEBS Standardization Mark badge (Kenya Bureau of Standards). | **Required** |
| `odpc-badge.png` | Office of the Data Protection Commissioner / Republic of Kenya badge. | **Required** |
| `ntsa-badge.png` | NTSA Certified badge — if provided, replaces the styled text placeholder in the code. | Optional |

## Notes
- All images should be PNG format.
- Transparent backgrounds are preferred for badges and signatures.
- If `signature.png`, `kebs-badge.png`, or `odpc-badge.png` are missing:
  - The **HTML preview** will show broken image icons for missing files.
  - The **PDF download** (frontend) will fail to generate. The backend PDF will skip them and log a warning.
- The `ntsa-badge.png` is optional. If not provided, a styled circular text badge ("NTSA Certified") is rendered as a placeholder.
- The company logo is sourced from `/nebsam_logo.png` (already present in `frontend/public/`). No logo file is needed in this `assets/` folder.
