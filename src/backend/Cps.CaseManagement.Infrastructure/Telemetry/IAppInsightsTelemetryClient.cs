namespace Cps.CaseManagement.Infrastructure.Telemetry;

using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights.DataContracts;

public interface IAppInsightsTelemetryClient
{
    void TrackEvent(string eventName, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null);
    void TrackException(Exception exception, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null);
    void TrackMetric(string name, double value, IDictionary<string, string>? properties = null);
    void TrackPageView(string name, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null);
    void TrackTrace(string message, SeverityLevel severityLevel, IDictionary<string, string>? properties = null);
}
