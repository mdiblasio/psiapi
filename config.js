const PSI_API_URL = 'https://content.googleapis.com/pagespeedonline/v5/runPagespeed';

const MAX_PENDING_TESTS = 20;

const FIELDS = {
  LH_Score: { type: 'score', key: `['lighthouseResult']['categories']['performance']['score']` },
  FCP_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['firstContentfulPaint']` },
  FCP_Score: { type: 'score', key: `['lighthouseResult']['audits']['first-contentful-paint']['score']` },
  FMP_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['firstMeaningfulPaint']` },
  FMP_Score: { type: 'score', key: `['lighthouseResult']['audits']['first-meaningful-paint']['score']` },
  SpeedIndex_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['speedIndex']` },
  SpeedIndex_Score: { type: 'score', key: `['lighthouseResult']['audits']['speed-index']['score']` },
  TTI_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['interactive']` },
  TTI_Score: { type: 'score', key: `['lighthouseResult']['audits']['interactive']['score']` },
  FCI_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['firstCPUIdle']` },
  FCI_Score: { type: 'score', key: `['lighthouseResult']['audits']['first-cpu-idle']['score']` },
  EIL_Value: { type: 'value', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['estimatedInputLatency']` },
  EIL_Score: { type: 'score', key: `['lighthouseResult']['audits']['estimated-input-latency']['score']` },
  Overall_Rank: { type: 'string', key: `['loadingExperience']['overall_category']` },
  FCP_Rank: { type: 'string', key: `['loadingExperience']['metrics']['FIRST_CONTENTFUL_PAINT_MS']['category']` },
  FCP_Fast: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_CONTENTFUL_PAINT_MS']['distributions']['0']['proportion']` },
  FCP_Avg: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_CONTENTFUL_PAINT_MS']['distributions']['1']['proportion']` },
  FCP_Slow: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_CONTENTFUL_PAINT_MS']['distributions']['2']['proportion']` },
  FID_Rank: { type: 'string', key: `['loadingExperience']['metrics']['FIRST_INPUT_DELAY_MS']['category']` },
  FID_Fast: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_INPUT_DELAY_MS']['distributions']['0']['proportion']` },
  FID_Avg: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_INPUT_DELAY_MS']['distributions']['1']['proportion']` },
  FID_Slow: { type: 'percentile', key: `['loadingExperience']['metrics']['FIRST_INPUT_DELAY_MS']['distributions']['2']['proportion']` },
  ScriptEvalTime: { type: 'scriptEvaluation', key: `['lighthouseResult']['audits']['mainthread-work-breakdown']['details']['items']` },
  ParseTime: { type: 'parseHTML', key: `['lighthouseResult']['audits']['mainthread-work-breakdown']['details']['items']` },
  DCL_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedDomContentLoaded']` },
  Mainthread_Breakdown: { type: 'displayString', key: `['lighthouseResult']['audits']['mainthread-work-breakdown']['displayValue']` },
  // oFCP_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedFirstContentfulPaint']` },
  // oFirstVisChange_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedFirstVisualChange']` },
  // oFMP_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedFirstMeaningfulPaint']` },
  // oFP_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedFirstPaint']` },
  // oLastVisChange_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedLastVisualChange']` },
  // oLoad_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedLoad']` },
  // oNavStart_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedNavigationStart']` },
  // oSpeedIndex_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedSpeedIndex']` },
  // oTraceEnd_Value: { type: 'number', key: `['lighthouseResult']['audits']['metrics']['details']['items']['0']['observedTraceEnd']` },
};

module.exports = {
  PSI_API_KEY,
  PSI_API_URL,
  MAX_PENDING_TESTS,
  FIELDS
};