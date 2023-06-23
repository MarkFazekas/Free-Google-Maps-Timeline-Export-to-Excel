import {Component, OnInit} from '@angular/core';
import {TimelineViewerService} from "../../service/timeline-viewer.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {Modal} from "bootstrap";

@Component({
  selector: 'app-timeline-viewer',
  templateUrl: './timeline-viewer.component.html',
  styleUrls: ['./timeline-viewer.component.scss']
})
export class TimelineViewerComponent implements OnInit {

  listOfData: any[] = []
  firstDate: NgbDate | null = null;
  secondDate: NgbDate | null = null;
  firstDateString: string | null = null;
  secondDateString: string | null = null;
  private $table: JQuery<HTMLElement> | null = null;

  saveInProgress = false;
  clearInProgress = false;

  constructor(
    private timelineViewerService: TimelineViewerService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.$table = $('#table');
    // @ts-ignore
    this.$table.bootstrapTable({
      columns: [
        {
          title: "ID",
          field: "id",
          sortable: true,
          filterControl: "input",
          visible: false,
        },
        {
          title: "Category",
          field: "category",
          sortable: true,
          filterControl: "input",
        },
        {
          title: "Distance in Meter",
          field: "distance",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("distance", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("distance", data)
        },
        {
          title: "Distance in Feet",
          field: "distanceInFeet",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("distanceInFeet", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("distanceInFeet", data)
        },
        {
          title: "Distance in KM",
          field: "distanceInKM",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("distanceInKM", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("distanceInKM", data)
        },
        {
          title: "Distance in Mile",
          field: "distanceInMile",
          sortable: true,
          filterControl: "input",
          formatter: (value: string, row: any) => this.formatValue("distanceInMile", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("distanceInMile", data)
        },
        {
          title: "Address",
          field: "address",
          sortable: true,
          filterControl: "input",
        },
        {
          title: "Name",
          field: "name",
          sortable: true,
          filterControl: "input",
        },
        {
          title: "Begin Time",
          field: "timeBegin",
          sortable: true,
          filterControl: "input",
          visible: false,
        },
        {
          title: "Begin Time",
          field: "timeBeginDateFormat",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("timeBeginDateFormat", value),
        },
        {
          title: "Begin Time",
          field: "timeBeginDateTimeFormat",
          sortable: true,
          filterControl: "input",
          formatter: (value: string, row: any) => this.formatValue("timeBeginDateTimeFormat", value),
        },
        {
          title: "End Time",
          field: "timeEnd",
          sortable: true,
          filterControl: "input",
          visible: false,
        },
        {
          title: "End Time",
          field: "timeEndDateFormat",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("timeEndDateFormat", value),
        },
        {
          title: "End Time",
          field: "timeEndDateTimeFormat",
          sortable: true,
          filterControl: "input",
          formatter: (value: string, row: any) => this.formatValue("timeEndDateTimeFormat", value),
        },
        {
          title: "Duration",
          field: "duration",
          sortable: true,
          filterControl: "input",
          formatter: (value: string, row: any) => this.formatValue("duration", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("duration", data)
        },
        {
          title: "Duration In Seconds",
          field: "durationInSec",
          sortable: true,
          filterControl: "input",
          visible: false,
          formatter: (value: string, row: any) => this.formatValue("durationInSec", parseInt(value)),
          footerFormatter: (data: { [key: string]: string }[], footerValue: any) => this.sumAndFormatFooter("durationInSec", data)
        },
        {
          title: "Latitude",
          field: "latitude",
          sortable: true,
          filterControl: "input",
          visible: false,
        },
        {
          title: "Longitude",
          field: "longitude",
          sortable: true,
          filterControl: "input",
          visible: false,
        },
      ],
      data: this.listOfData,
      exportTypes: ['pdf', 'excel', 'xlsx', 'json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc',],
      exportOptions: {
        fileName: () => this.getCurrentFileName(this.datePipe, this.firstDateString, this.secondDateString),
        jspdf: {
          orientation: 'l',
          margins: {left: 10, right: 10, top: 20, bottom: 20},
          autotable: {
            styles: {overflow: 'linebreak'},
            tableWidth: 'wrap',
          }
        },
        exportFooter: true,
      },
    });

  }

  getCurrentFileName(pipe: DatePipe, firstDateString: string | null, secondDateString: string | null) {
    return `TimelineViewer${firstDateString}-${secondDateString}`;
  }

  sumAndFormatFooter(keyName: string, data: { [key: string]: string }[]) {
    const summedValue = this.sum(data, keyName);
    return this.formatValue(keyName, summedValue);
  }

  formatValue(keyName: string, value: any): string {
    switch (keyName) {
      case "distance": {
        return `${(value as number).toLocaleString('en')} m`
      }
      case "distanceInKM": {
        return `${(value / 1000).toLocaleString('en')} km`
      }
      case "distanceInFeet": {
        return `${(value * 3.28084).toLocaleString('en')} feet`
      }
      case "distanceInMile": {
        return `${(value * 0.000621371).toLocaleString('en')} mile`
      }
      case "duration": {
        const seconds = Math.floor((value / 1000) % 60);
        const minutes = Math.floor((value / 1000 / 60) % 60);
        const hours = Math.floor((value / 1000 / 3600) % 24);
        const humanized = [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':');
        return humanized;
      }
      case "durationInSec": {
        return `${Math.floor(value / 1000).toLocaleString('en')} sec`
      }
      case "timeBeginDateFormat":
      case "timeEndDateFormat": {
        const date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        return date.toLocaleDateString('en-US', options);
      }
      case "timeBeginDateTimeFormat":
      case "timeEndDateTimeFormat": {
        const date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
      }
    }
    return "";
  }

  sum(data: { [key: string]: string }[], keyName: string) {
    return data.reduce((acc, obj) => acc + parseInt(obj[keyName]), 0);
  }

  enrichLoadedData(dataList: { [key: string]: any }[]) {
    for (let data of dataList) {
      data["durationInSec"] = data["duration"];
      data["distanceInFeet"] = data["distance"];
      data["distanceInKM"] = data["distance"];
      data["distanceInMile"] = data["distance"];
      data["timeBeginDateFormat"] = data["timeBegin"];
      data["timeEndDateFormat"] = data["timeEnd"];
      data["timeBeginDateTimeFormat"] = data["timeBegin"];
      data["timeEndDateTimeFormat"] = data["timeEnd"];
    }
    return dataList;
  }

  onDateRangeSelected($event: [(NgbDate | null), (NgbDate | null)]) {
    this.firstDate = $event[0];
    this.secondDate = $event[1];

    if (this.firstDate != null) {
      this.firstDateString = this.datePipe.transform(`${this.firstDate.year}-${this.firstDate.month}-${this.firstDate.day}`)
    } else {
      this.firstDateString = null;
    }
    if (this.secondDate != null) {
      this.secondDateString = this.datePipe.transform(`${this.secondDate.year}-${this.secondDate.month}-${this.secondDate.day}`)
    } else {
      this.secondDateString = null;
    }

    console.log(this.firstDateString)
    console.log(this.secondDateString)
    if (this.firstDate != null && this.secondDate != null) {
      console.log(this.firstDate.year, this.firstDate.month, this.firstDate.day, this.secondDate.year, this.secondDate.month, this.secondDate.day)
      const promiseOfFata = this.timelineViewerService.getDataFromDateRange(this.firstDate.year, this.firstDate.month, this.firstDate.day, this.secondDate.year, this.secondDate.month, this.secondDate.day);
      promiseOfFata.then((collectedDataList) => {
        this.listOfData = this.enrichLoadedData(collectedDataList);
        // @ts-ignore
        this.$table.bootstrapTable('load', this.listOfData);
        // Review Kereés
        // const myModalAlternative = new Modal('#staticBackdrop')
        // myModalAlternative.show()
      })
    }
  }

  async getDownloadPermission() {
    console.log("Request permission");
    const permissionResponse = await chrome.permissions.request({
      permissions: ['downloads'],
    });
    console.log("Permission response", permissionResponse);
    return permissionResponse;
  }

  async revokeDownloadPermission() {
    console.log("Revoke permission");
    const permissionRevoke = await chrome.permissions.remove({
      permissions: ['downloads'],
    });
    console.log("Permission Revoke", permissionRevoke);
  }

  async saveAsKML() {
    this.saveInProgress = true;
    if (await this.getDownloadPermission()) {
      await this.saveAllKML();
      await this.revokeDownloadPermission();
    } else {
      alert("We need the download permission to save the KML files.");
    }
    this.saveInProgress = false;
  }

  async saveAllKML() {
    const resolvedData: object = await chrome.storage.local.get(null);

    let index = 0;
    let lastDownloadId = 0;
    for (let object of Object.entries(resolvedData)) {
      // console.log(object, object[0], object[1]);
      const blob = new Blob([object[1]], {type: 'application/xml'});
      const url = URL.createObjectURL(blob);
      const saveFileName = `TimelineViewer/${object[0]}.kml`;

      console.log(saveFileName, index);

      lastDownloadId = await chrome.downloads.download({
        url: url,
        filename: saveFileName,
        saveAs: false
      });
      index++;
    }

    await new Promise(resolve => {
      chrome.downloads.onChanged.addListener(function onChanged({id, state}) {
        if (id === lastDownloadId && state && state.current === 'complete') {
          chrome.downloads.onChanged.removeListener(onChanged);
          resolve(null);
        }
      });
    });

    await chrome.downloads.show(lastDownloadId);
  }

  async clearCache() {
    this.clearInProgress = true;
    await chrome.storage.local.clear();
    console.log("Cache Cleared");
    this.clearInProgress = false;
  }
}
