/**
 * Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, DoCheck, Input, isDevMode, OnInit,ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SmartRuleInterface } from '../interfaces/smartRule.interface';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observer } from 'rxjs';
import { LocationSearchService } from './../services/locationSearch.service';
import { LocationResult } from './../interfaces/locationSearch.model';
import * as turf from '@turf/turf';
import { SELECTION_MODEL_FACTORY } from '@ng-select/ng-select';
import { DefaultSelectionModelFactory } from '../icon-selector/selection-model';
import { FormBuilder } from '@angular/forms';
const L: any = window.L;

@Component({
  selector: 'lib-app-route-tracker-config',
  templateUrl: './gp-route-tracker-config.component.html',
  styleUrls: [ '../../node_modules/@ng-select/ng-select/themes/default.theme.css' ,'./gp-route-tracker-config.component.css'],
  encapsulation: ViewEncapsulation.None,
    providers: [FormBuilder,
      { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
    ],
})
export class GpRouteTrackerConfigComponent implements OnInit, DoCheck {
  @Input() config: any = {};
  smartRuleConfig: SmartRuleInterface = {};
  protected layerControl = L.control.layers([], [], {});
  private allGoefences: any = [];
  protected map: any;

  smartRuleTriggerOptions = [
    { value: 'entering', viewValue: 'On entering' },
    { value: 'leaving', viewValue: 'On leaving' },
    { value: 'both', viewValue: 'On entering and leaving' },
  ];
  smartRuleSeverityOptions = ['WARNING', 'MINOR', 'MAJOR', 'CRITICAL'];
  userSelectedColor = [];
  result;
  value = '';
  routeEndvalue = '';
  suggestions$: Observable<any[]>;
  routeEndSuggestions$: Observable<any[]>;
  isLoading = false;
  routeStartPlace = '';
  routeEndPlace = '';
  routeStartLatCoord;
  routeStartLngCoord;
  routeEndLatCoord;
  routeEndLngCoord;
  geofenceRadius;
  isOpenCP = false;
  iconColorCode ='#000000';
  markerColorCode ='#000000';

  constructor(private locationSearchAPI: LocationSearchService) {}

  ngOnInit(): void {
    if (this.config && this.config.smartRuleConfig) {
      this.smartRuleConfig = this.config.smartRuleConfig;
    }
    this.suggestions$ = new Observable((observer: Observer<any>) => {
      this.locationSearchAPI.searchGeoLocation(this.value).subscribe((res: any) => {
        observer.next(res);
      });
    });
    this.routeEndSuggestions$ = new Observable((observer: Observer<any>) => {
      this.locationSearchAPI.searchGeoLocation(this.routeEndvalue).subscribe((res: any) => {
        observer.next(res);
      });
    });

    if(this.config.iconColor){
      this.colorUpdateByTyping(this.config.iconColor);
    }
    if(this.config.markerColor){
      this.markerColorUpdateByTyping(this.config.markerColor);
    }
  }

  // Update the icon colors input from color picker
  colorUpdate(colorSelected): void {
    this.config.iconColor = colorSelected;
  }

  // Update the icon colors input from color input box
  colorUpdateByTyping(colorTyped): void {
    this.iconColorCode = colorTyped;
  }
  // Update the marker colors input from color picker
  markerColorUpdate(colorSelected): void {
    this.config.markerColor = colorSelected;
  }

  // Update the marker colors input from color input box
  markerColorUpdateByTyping(colorTyped): void {
    this.markerColorCode= colorTyped;
  }
  calledthis(address): void {
  }
  changeTypeaheadLoading(e: boolean): void {
    this.isLoading = e;
  }
  /**
   * Change map coordinates based on location search API output
   */
  displayFn(searchResult: LocationResult): void {
    if (searchResult) {
      this.config.startLat = searchResult.lat;
      this.config.startLng = searchResult.lon;
      this.routeStartLatCoord = searchResult.lat;
      this.routeStartLngCoord = searchResult.lon;
      this.config.routeStartPlace = searchResult.display_name;
    }
  }
  displayFunc(searchResult: LocationResult): void {
    if (searchResult) {
      this.config.endLat = searchResult.lat;
      this.config.endLng = searchResult.lon;
      this.routeEndLatCoord = searchResult.lat;
      this.routeEndLngCoord = searchResult.lon;
      this.config.routeEndPlace = searchResult.display_name;
      this.__doRenderGeofencesOnMap();
    }
  }

  // On providing of start address or lat and long
  onRouteStartSelect(event: TypeaheadMatch): void {
    this.displayFn(event.item);
  }

  // On providing of end address or lat and long
  onRouteEndSelect(event: TypeaheadMatch): void {
    this.displayFunc(event.item);
  }

  /**
   * Render geofence on map
   */
  private async __doRenderGeofencesOnMap(e?: any): Promise<void> {
    this.allGoefences.push([this.routeStartLatCoord, this.routeStartLngCoord]);
    this.allGoefences.push([this.routeEndLngCoord, this.routeEndLngCoord]);

    const bufferLine: any = {
      type: 'Feature',
      properties: {
        color: 'blue',
      },
      geometry: {
        type: 'LineString',
        coordinates: this.allGoefences,
      },
    };
    const geoFencesByLevels = [];
    const polygonGeometry = turf.buffer(bufferLine, this.geofenceRadius, {
      units: 'meters',
    });
    const geoFence = new L.Polygon(polygonGeometry.geometry.coordinates, {
      color: 'blue',
      weight: 1,
      className: 'lt-gf-base',
    });
    geoFencesByLevels.push(geoFence);
    const fgOnLvl = { name: 'GeoFence', floor: 0, layer: L.featureGroup(geoFencesByLevels) };
    fgOnLvl.layer.bringToFront();
    this.layerControl.addOverlay(fgOnLvl.layer, fgOnLvl.name);
    this.layerControl.addTo(this.map);
  }

  async ngDoCheck(): Promise<void> {
    this.config.smartRuleConfig = this.smartRuleConfig;
    this.geofenceRadius = this.config.geofenceRadius;
  }
}
