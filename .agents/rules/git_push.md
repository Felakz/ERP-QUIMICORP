# Git Push Policy - ERP QUIMICORP

En este repositorio (`ERP-QUIMICORP`), existen dos remotos configurados:
- `origin`: `https://github.com/Felakz/ERP-QUIMICORP.git`
- `fork`: `https://github.com/Sistemas-FLK/ERP-QUIMICORP.git`

## Regla obligatoria
Siempre que el usuario solicite subir cambios al repositorio ("sube todo", "haz push", etc.), se deben actualizar **ambos** remotos obligatoriamente:
1. `git push origin <rama>`
2. `git push fork <rama>`
