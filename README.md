
# Deprecation notice
This plugin is not further developed and it might break with upcoming Cumulocity releases. Use it at your own risk.
The repository is archived but feel free to fork & adapt it to your needs in a new repo.

# Route Tracker Widget for Cumulocity [<img width="35" src="https://user-images.githubusercontent.com/32765455/211497905-561e9197-18b9-43d5-a023-071d3635f4eb.png"/>](https://github.com/Cumulocity-IoT/cumulocity-route-tracker-plugin/releases/download/1.0.2/sag-ps-pkg-route-tracker-runtime-widget-1.0.2.zip)

  
This Route Tracker widget is the Cumulocity module federation plugin created using c8ycli. This plugin can be used in Application Builder or Cockpit.
The Route Tracker widget help you to display route, geofence along with realtime device status and also one can enable the smart rule which gets trigged when smart rule violation happens.


### Please choose Route Tracker release based on Cumulocity/Application builder version:

|APPLICATION BUILDER&nbsp; |&nbsp; CUMULOCITY &nbsp;|&nbsp; ROUTE TRACKER WIDGET&nbsp; |
|--------------------|------------|----------------------|
| 2.x.x | >= 1016.x.x| 1.x.x                | 

  
## Representation

![RouteTrackermain](assets/route-tracker.png)
  

## Prerequisite
   Cumulocity c8ycli >=1016.x.x
   
   
## Installation

### Runtime Widget Deployment?

* This widget support runtime deployment. Download [Runtime Binary](https://github.com/Cumulocity-IoT/cumulocity-route-tracker-plugin/releases/download/1.0.2/sag-ps-pkg-route-tracker-runtime-widget-1.0.2.zip) and install via Administrations --> Ecosystems --> Applications --> Packages.


## QuickStart
This guide will teach you how to add widget in your existing or new dashboard.

1. Open you application from App Switcher

2. Add new dashboard or navigate to existing dashboard

3. Click `Add Widget`

4. Search for `Route Tracker`

5. Select `Target Assets or Devices`

7. Click `Save`

Congratulations! Smart Map is configured.

  
## User Guide

![RouteTrackerConfiguration](assets/config-tracker.png)
1. Takes device name, geofence radius, start and end address/latitude and longitude, icon name color, marker color and smart rule configuration as input.

2. If configured Smart rule with provided name doesn't exist then a new rule get created and if the rule with provided name exists then it updates the existing rule.
**Note** Make sure for different devices and for different configuration a unique smart rule name need to be provided else it overrides if the rule with name exists.

To check the smart rules please navigate to Application Switcher -> Cockpit -> Configuration -> Global smart rule


------------------------------

This widget is provided as-is and without warranty or support. They do not constitute part of the Cumulocity product suite. Users are free to use, fork and modify them, subject to the license agreement. While Cumulocity GmbH welcomes contributions, we cannot guarantee to include every contribution in the master project.
_____________________

For more information you can ask a question in the [Tech community Forums](https://techcommunity.cumulocity.com).

