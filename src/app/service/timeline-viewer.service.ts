import {Injectable} from '@angular/core';
import {kml} from '@tmcw/togeojson'
import {
  Feature,
  FeatureCollection,
  Geometry,
  Point
} from "geojson";

interface UsualProperties {
  Category: any
  Distance: any
  address: any
  description: any
  name: any
  timespan: any
}

type CollectedData = {
  id?: number;
  category: any;
  distance: any;
  address: any;
  name: any;
  timeBegin: any;
  timeEnd: any;
  duration: number;
  latitude: number | null;
  longitude: number | null;
}


@Injectable({
  providedIn: 'root'
})
export class TimelineViewerService {

  constructor() {
  }

  async getKMLFromURLOrCache(year: number, month: number, day: number): Promise<string | null> {
    const save_key = `timeline_kml_${year}_${month.toString().padStart(2, '0')}_${day.toString().padStart(2, '0')}`;
    const resolved_data = await chrome.storage.local.get(save_key);
    console.log("resolved_data", save_key, save_key in resolved_data, resolved_data);
    if (save_key in resolved_data) {
      console.log("resolved_data[save_key]", resolved_data[save_key])
      return (resolved_data[save_key] as string);
    }

    // A google JavaScript dátumot használ.
    const requestURL = `https://timeline.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${year}!2i${month - 1}!3i${day}!2m3!1i${year}!2i${month - 1}!3i${day}`;
    const a: Response = await fetch(requestURL);
    const res = await a.text();

    if (a.status !== 200 || !a.url.startsWith(`https://timeline.google.com/`) || !res.startsWith("<?xml") || !(res.includes("kml"))) {
      console.log("Something went wrong.", year, month, day);
      return null;
    }

    const objectToSave = {[save_key]: res};
    console.log("objectToSave", objectToSave)
    await chrome.storage.local.set(objectToSave);

    return res;
  }

  private convert_text_to_kml_dom(res: string) {
    const kmlDom: Document = (new DOMParser()).parseFromString(res, 'text/xml');
    const geo: FeatureCollection<Geometry | null> = kml(kmlDom)
    return geo;
  }

  async getDataFromOneDay(date: Date): Promise<null | { "date": Date, "entries": CollectedData[] }> {
    console.log("getDataFromOneDay", date.getFullYear(), date.getMonth() + 1, date.getDate());
    const res = await this.getKMLFromURLOrCache(date.getFullYear(), date.getMonth() + 1, date.getDate());

    if (res === null) {
      console.log("Not valid response", date);
      return null;
    }
    const geo = this.convert_text_to_kml_dom(res);

    const entries = []
    for (const feature of geo.features) {
      const q_feature: Feature<Geometry, UsualProperties> = (<Feature<Geometry, UsualProperties>>feature);

      const begin: Date = new Date(q_feature.properties.timespan.begin);
      const end: Date = new Date(q_feature.properties.timespan.end);
      const duration = Math.abs(begin.valueOf() - end.valueOf());

      entries.push({
        category: q_feature.properties.Category,
        distance: q_feature.properties.Distance,
        address: q_feature.properties.address,
        name: q_feature.properties.name,
        timeBegin: q_feature.properties.timespan.begin,
        timeEnd: q_feature.properties.timespan.end,
        duration: duration,
        latitude: q_feature.geometry?.type === 'Point' ? (q_feature.geometry as Point).coordinates[1] : null,
        longitude: q_feature.geometry?.type === 'Point' ? (q_feature.geometry as Point).coordinates[0] : null
      })
    }

    return {"date": date, "entries": entries}
  }

  async getDataFromDateRange(
    year_from: number, month_from: number, day_from: number,
    year_to: number, month_to: number, day_to: number,
  ): Promise<CollectedData[]> {
    const date1 = new Date(year_from, month_from - 1, day_from);
    const date2 = new Date(year_to, month_to - 1, day_to);
    const dates = this.getDatesBetween(date1, date2);
    console.log(dates);
    const date_resolver_promises:  Promise<{date: Date, entries: CollectedData[]} | null>[] = [];
    for (let date of dates) {
      console.log(date);
      date_resolver_promises.push(this.getDataFromOneDay(date));
    }
    const resolved_data_from_dates: Awaited<{ date: Date; entries: CollectedData[] } | null>[]  = await Promise.all(date_resolver_promises);

    console.log(resolved_data_from_dates);
    const listed_data_from_dates = [];
    let id = 1;
    for (let data_tuple of resolved_data_from_dates) {
      if (data_tuple === null) {
        continue;
      }
      let entries = data_tuple["entries"];
      for (const entry of entries) {
        entry["id"] = id;
        id++;
        listed_data_from_dates.push(entry);
      }
    }

    console.log(listed_data_from_dates);
    return listed_data_from_dates;
  }

  getDatesBetween(startDate: Date, endDate: Date): Date[] {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
}
