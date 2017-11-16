import { DeviceService } from '../providers/device-service/device-service';
import { DataTable } from "primeng/primeng";
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'at-nestcam',
  templateUrl: './nestcam.component.html'
})
export class NestcamComponent implements OnInit {
  @ViewChild("dt") dt : DataTable;
  allLogData = [];
  isStreaming: boolean;
  cameraName: string;
  logId: string;
  logCameraId: string;
  logCameraName: string;
  logDate: Date;

  constructor(private apollo: Apollo, private _deviceService: DeviceService) {

    // Subscribe to devices$ Observable.
    this._deviceService.devices$.subscribe(devices => {

      const nestcams = devices;

    });

  }

  ngOnInit() {

    const AllNestCams = gql`
    query allNestCams {
      allNestCams {
          id
          name
          isStreaming
        }
    }`;

    const queryObservable = this.apollo.watchQuery({

      query: AllNestCams,
      pollInterval: 500

    }).subscribe(({ data, loading }: any) => {

      this.isStreaming = data.allNestCams[0].isStreaming;

      if (this.isStreaming) {

        this.cameraName = data.allNestCams[0].name;

      } else {

        this.cameraName = 'Offline';

      }

    });

    const AllLogDatas = gql`
      allLogDatas {
          id
          cameraId
          cameraName
          logDate
        }
    }`;

    const queryLogObservable = this.apollo.watchQuery({
      
            query: AllLogDatas,
            pollInterval: 500
      
          }).subscribe(({ data, loading }: any) => {
            this.allLogData = data.allLogDatas;
            this.logId = data.allNestCamsLog[0].id;
            this.logCameraName = data.allNestCamsLog[0].cameraName;
            this.logCameraId = data.allNestCamsLog[0].cameraId;
            this.logDate = data.allNestCamsLog[0].logDate;
      
          });

  }

}