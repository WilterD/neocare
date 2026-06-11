# Smoke test NeoCare API
$base = "http://localhost:4000/api"
$ok = 0
$fail = 0

function Test-Endpoint {
  param($Name, $Method, $Url, $Body, $Headers, $ExpectStatus)
  try {
    $params = @{ Uri = $Url; Method = $Method; ErrorAction = "Stop"; TimeoutSec = 15; UseBasicParsing = $true }
    if ($Body) { $params.Body = $Body; $params.ContentType = "application/json" }
    if ($Headers) { $params.Headers = $Headers }
    $r = Invoke-WebRequest @params
    if ($ExpectStatus -and $r.StatusCode -ne $ExpectStatus) { throw "Status $($r.StatusCode)" }
    Write-Host "[OK] $Name" -ForegroundColor Green
    $script:ok++
    return $r
  } catch {
    Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
    $script:fail++
    return $null
  }
}

Write-Host "`n=== NeoCare Smoke Test ===`n" -ForegroundColor Cyan

Test-Endpoint "Health" GET "http://localhost:4000/"
Test-Endpoint "Contenido educativo (28)" GET "$base/contenido-educativo"
$c = (Invoke-RestMethod "$base/contenido-educativo").total
if ($c -ge 28) { Write-Host "[OK] Total articulos: $c" -ForegroundColor Green; $ok++ } else { Write-Host "[FAIL] Solo $c articulos" -ForegroundColor Red; $fail++ }

Test-Endpoint "Testimonios (4)" GET "$base/testimonios"
$t = (Invoke-RestMethod "$base/testimonios").testimonios.Count
if ($t -ge 4) { Write-Host "[OK] Testimonios: $t" -ForegroundColor Green; $ok++ } else { Write-Host "[FAIL] Testimonios: $t" -ForegroundColor Red; $fail++ }

$email = "smoke_$(Get-Random)@test.com"
$regBody = @{
  consentimiento = $true
  madre = @{
    nombreCompleto = "Maria Smoke Test"; edad = 28; telefono = "0412123456"
    correo = $email; password = "test1234"; numeroIdentificacion = "V12345678"
    nivelEducativo = "Superior"; zonaResidencia = "Urbana"; accesoCentroSalud = "Si"
    situacionEconomica = "Media"; relacionRecienNacido = "Madre"; numeroNinosCuidado = 1
    cuidaSinApoyo = "No"; apoyoFamiliar = "Si"; apoyoPrincipal = "Pareja"; primeraVezCuidando = "Si"
  }
  bebe = @{ nombreBebe = "Bebe Test"; fechaNacimiento = "01/03/2026"; sexo = "Masculino"; pesoNacer = 3200; edadGestacional = 38 }
  datosClinicos = @{
    tipoParto = "Vaginal"; complicacionesNacer = "No"; hospitalizacionNeonatal = "No"
    cuidadosEspeciales = "No"
  }
} | ConvertTo-Json -Depth 5

$reg = Invoke-RestMethod -Uri "$base/registro" -Method POST -Body $regBody -ContentType "application/json"
if ($reg.token) { Write-Host "[OK] Registro + JWT" -ForegroundColor Green; $ok++ } else { Write-Host "[FAIL] Registro" -ForegroundColor Red; $fail++ }

$token = $reg.token
$auth = @{ Authorization = "Bearer $token" }

Test-Endpoint "Perfil me" GET "$base/perfil/me" -Headers $auth
Test-Endpoint "Evaluaciones" GET "$base/evaluaciones" -Headers $auth
Test-Endpoint "Bebes" GET "$base/bebes" -Headers $auth

$bebeId = $reg.usuario.bebe.id
if ($bebeId) {
  $vac = Invoke-RestMethod -Uri "$base/vacunas/$bebeId" -Headers $auth
  if ($vac.vacunas.Count -ge 3) { Write-Host "[OK] Vacunas seed: $($vac.vacunas.Count)" -ForegroundColor Green; $ok++ } else { Write-Host "[FAIL] Vacunas" -ForegroundColor Red; $fail++ }
}

$contactBody = '{"nombre":"Test","correo":"a@b.com","asunto":"Prueba","mensaje":"Hola"}'
Test-Endpoint "Contacto publico" POST "$base/contacto" -Body $contactBody

Test-Endpoint "Forgot password" POST "$base/auth/forgot-password" -Body ('{"email":"' + $email + '"}')

Write-Host "`n=== Resultado: $ok OK, $fail FAIL ===`n" -ForegroundColor Cyan
if ($fail -gt 0) { exit 1 }
