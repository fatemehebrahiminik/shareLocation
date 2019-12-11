import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { defaults as defaultControls } from 'ol/control';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationServices } from '../../Services/LocationServices';
import { fromLonLat, transform } from 'ol/proj'; 
import Overlay from 'ol/Overlay';
import { Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon  } from 'ol/style';
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { ArrayType } from '@angular/compiler/src/output/output_ast';
@Component({
    selector: 'home',
    templateUrl: './home.component.html'
}) 
export class HomeComponent implements AfterViewInit, OnInit {
    locationForm: FormGroup;
    map: Map;
    source: VectorSource; 
    mapLoc: Map;
    sourceLoc: VectorSource;
    errorMessage: any;
    markers: Array<any> = [];
    locType: Array<string> = ["Business", "Health Center","Home","Education Center"]
    popup: Overlay;
    @ViewChild('closeModal') private closeModal: ElementRef;
    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _LocationServices: LocationServices, private _router: Router) {
        this.locationForm = this._fb.group({
            id: 0,
            locName: ['', [Validators.required]],
            type: ['', [Validators.required]],
            logo: File ,
            lat: ['', [Validators.required]],
            lng: ['', [Validators.required]]
        });
        _LocationServices.getAllLocations().subscribe(data => {
            this.markers = data;
            for (let x of data) {
                console.log(x);
                this.addMarker(fromLonLat([x.lng, x.lat]), this.source, x);
            }
        });
    } 
    ngOnInit() {
     
    }
    ngAfterViewInit() {
        this.source = new VectorSource({});
        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([59.516463, 36.368066]),
                zoom: 14
            }),
            controls: defaultControls().extend([
                new ZoomToExtent({
                    extent: [
                        813079.7791264898, 5929220.284081122,
                        848966.9639063801, 5936863.986909639
                    ]
                })
            ])
        }); 
        var layer = new VectorLayer({ source: this.source });
        this.map.addLayer(layer);
        this.popup = new Overlay({
            element: document.getElementById('popup') as HTMLElement
        });
     
      //map loca
        this.sourceLoc = new VectorSource({});
        this.mapLoc = new Map({
            target: 'mapLoc',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([59.516463, 36.368066]),
                zoom: 14
            })
        });
        var layerLoc = new VectorLayer({ source: this.sourceLoc });
        this.mapLoc.addLayer(layerLoc);
    }
    getCoord(event: any) {
        var coordinate = this.mapLoc.getEventCoordinate(event);
        if (coordinate) {
          //  console.log(coordinate)
            var coords = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            this.locationForm.patchValue({
                "lat": coords[1],
                "lng": coords[0]
            }); 
            this.sourceLoc.clear();
            this.addMarker(coordinate, this.sourceLoc, null)
         //   console.log(this.locationForm);  
         
        }
    }
    getLocationDetail(event: any) {
        var coordinate = this.map.getEventCoordinate(event);
        if (coordinate) { 
            var f = this.map.forEachFeatureAtPixel(
                this.map.getEventPixel(event),
                function (ft, layer) { return ft; }); 
            if (f && f.get('type') == 'click') {
                this.map.addOverlay(this.popup);
                var content = this.popup.getElement() as HTMLElement;
                content.getElementsByClassName('nameLoc')[0].innerHTML = " " + f.get('markerData').locName; 
                content.getElementsByClassName('typeLoc')[0].innerHTML = " " + this.locType[f.get('markerData').type]; 
                content.getElementsByClassName('logoLoc')[0].setAttribute('src', f.get('markerData').logo); 

                this.popup.setPosition(coordinate); 
            }
            else   this.map.removeOverlay(this.popup);
        }
    }
    save() {

        if (!this.locationForm.valid) {
            return;
        }
        console.log(this.locationForm.value);
        this._LocationServices.saveLocation(this.locationForm.value)
            .subscribe((data) => {
                var data = this.locationForm.value;
                //close popup
                this.closeModal.nativeElement.click();    
                //add marker
                console.log(data)
                this.addMarker(fromLonLat([data.lng, data.lat]), this.source, data)
            }, error => this.errorMessage = error);
        
       
    }

    cancel() {
     
    }
    onLogoPicked(files: FileList) {
        var file: File = files.item(0); 
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => { 
            this.locationForm.patchValue({
                "logo": myReader.result
            }); 
        }
        myReader.readAsDataURL(file);
       
     //   console.log(this.locationForm);

    }
    get locName() { return this.locationForm.get('locName'); }
    get type() { return this.locationForm.get('type'); }
    get logo() { return this.locationForm.get('logo'); }
    get lat() { return this.locationForm.get('lat'); ; }
    get lng() { return this.locationForm.get('lng');; }

    addMarker(coordinate, source, data) {
      //  console.log('lon:', lon);
       // console.log('lat:', lat);
        console.log(new Point(coordinate)) 
        var marker = new Feature({
            geometry: new Point(coordinate), // dont worry about coordinate type 0,0 will be in west coast of africa,
            type: 'click',
            markerData: data
        }); 
        marker.setStyle(new Style({
            image: new Icon(({
                src: 'http://image.nikbanoo.com/location.png'
            }))
        }));
        source.addFeature(marker);
    }
    updateMapLoc() {
        setTimeout(() => { 
            this.mapLoc.updateSize();
        }, 200);   
        console.log('updateSize call');
    }
}
