export function saveUTMParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");

  if (utmSource || utmMedium || utmCampaign) {
    const utmData = {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("utm_params", JSON.stringify(utmData));
  }
}

export function getUTMParams() {
  const raw = localStorage.getItem("utm_params");
  return raw ? JSON.parse(raw) : null;
}
