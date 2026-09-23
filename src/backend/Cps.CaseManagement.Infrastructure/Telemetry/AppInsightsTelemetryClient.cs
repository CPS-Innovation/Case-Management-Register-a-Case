namespace Cps.CaseManagement.Infrastructure.Telemetry;

using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights.DataContracts;
using AppInsights = Microsoft.ApplicationInsights;

public class AppInsightsTelemetryClientWrapper : IAppInsightsTelemetryClient
{
    private readonly AppInsights.TelemetryClient _telemetryClient;

    public AppInsightsTelemetryClientWrapper(AppInsights.TelemetryClient telemetryClient)
    {
        _telemetryClient = telemetryClient;
    }

    public void TrackEvent(string eventName, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null)
    {
        _telemetryClient.TrackEvent(eventName, properties, metrics);
    }

    public void TrackException(Exception exception, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null)
    {
        _telemetryClient.TrackException(exception, properties, metrics);
    }

    public void TrackMetric(string name, double value, IDictionary<string, string>? properties = null)
    {
        _telemetryClient.TrackMetric(name, value, properties);
    }

    public void TrackPageView(string name, IDictionary<string, string>? properties = null, IDictionary<string, double>? metrics = null)
    {
        var pageViewTelemetry = new PageViewTelemetry(name);

        if (properties != null)
        {
            foreach (var property in properties)
            {
                pageViewTelemetry.Properties[property.Key] = property.Value;
            }
        }

        if (metrics != null)
        {
            foreach (var metric in metrics)
            {
                pageViewTelemetry.Metrics[metric.Key] = metric.Value;
            }
        }

        _telemetryClient.TrackPageView(pageViewTelemetry);
    }

    public void TrackTrace(string message, SeverityLevel severityLevel, IDictionary<string, string>? properties = null)
    {
        _telemetryClient.TrackTrace(message, severityLevel, properties);
    }
}
