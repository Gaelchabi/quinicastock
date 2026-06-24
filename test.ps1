[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$req = [Net.HttpWebRequest]::Create('http://localhost:8080/auth/login')
$req.Method = 'POST'
$req.ContentType = 'application/json'
$req.ServicePoint.Expect100Continue = $false
$body = '{"email":"test@test.com","password":"test123"}'
$sw = New-Object System.IO.StreamWriter($req.GetRequestStream())
$sw.Write($body)
$sw.Close()
try {
    $resp = $req.GetResponse()
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $sr.ReadToEnd()
} catch {
    "Status: " + $_.Exception.Response.StatusCode
    "Message: " + $_.Exception.Message
}
