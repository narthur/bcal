import * as functions from "firebase-functions";
import axios from "axios";
import ical from "ical-generator";

interface Goal {
  slug?: string;
  title?: string;
  description?: null | string;
  goalval?: null;
  rate?: number;
  goaldate?: number;
  svg_url?: string;
  graph_url?: string;
  thumb_url?: string;
  goal_type?: string;
  autodata?: null | string;
  healthkitmetric?: string;
  // Unix timestamp of derailment. When you'll cross the bright red line if
  // nothing is reported.
  losedate: number;
  deadline?: number;
  leadtime?: number;
  alertstart?: number;
  use_defaults?: boolean;
  id?: string;
  ephem?: boolean;
  queued?: boolean;
  panic?: number;
  updated_at?: number;
  burner?: string;
  yaw?: number;
  lane?: number;
  lanewidth?: number;
  delta?: number;
  runits?: string;
  limsum?: string;
  frozen?: boolean;
  lost?: boolean;
  won?: boolean;
  contract?: Contract;
  delta_text?: string;
  safebump?: number;
  safesum?: string;
  limsumdate?: string;
  limsumdays?: string;
  baremin?: string;
  baremintotal?: string;
  roadstatuscolor?: string;
  lasttouch?: Date;
  safebuf?: number;
  coasting?: boolean;
  integery?: boolean;
  fineprint?: null | string;
  todayta?: boolean;
  hhmmformat?: boolean;
  gunits?: string;
  weekends_off?: boolean;
  yaxis?: string;
  maxflux?: null;
  tmin?: Date | null;
  tmax?: null;
  initday?: number;
  initval?: number;
  curday?: number;
  curval?: number;
  lastday?: number;
  dir?: number;
  kyoom?: boolean;
  odom?: boolean;
  noisy?: boolean;
  aggday?: string;
  plotall?: boolean;
  steppy?: boolean;
  rosy?: boolean;
  movingav?: boolean;
  aura?: boolean;
  numpts?: number;
  road?: Array<Array<number | null>>;
  roadall?: Array<Array<number | null>>;
  fullroad?: Array<number[]>;
  secret?: boolean;
  pledge?: number;
  mathishard?: number[];
  headsum?: string;
  datapublic?: boolean;
  graphsum?: string;
  rah?: number;
  last_datapoint?: LastDatapoint;
  callback_url?: null;
  // A list of the goal's tags.
  tags: string[];
  recent_data?: RecentDatum[];
  dueby?: { [key: string]: Dueby };
}

interface Contract {
  amount: number;
  stepdown_at: null;
  pending_amount: null;
  pending_at: null;
}

interface Dueby {
  delta: number;
  total: number;
  formatted_delta_for_beedroid: string;
  formatted_total_for_beedroid: string;
}

interface LastDatapoint {
  timestamp: number;
  value: number;
  comment: string;
  id: string;
  updated_at: number;
  requestid: null | string;
  canonical: string;
  fulltext: string;
  origin: string;
  daystamp: string;
}

interface RecentDatum {
  id: ID;
  fulltext: string;
  canonical: string;
  origin: string;
  urtext: null;
  measured_at: Date;
  created_at: Date;
  comment: null | string;
  value: number;
  daystamp: string;
}

interface ID {
  $oid: string;
}

export const calendar = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});

  const user = request.query.user;
  const token = request.query.token;

  if (!user || !token) {
    response.status(400).send("Missing user or token");
    return;
  }

  const goals = await axios.get(`https://www.beeminder.com/api/v1/users/${user}/goals.json?auth_token=${token}`);

  const calendar = ical({
    name: `${user}'s Beeminder goals`,
  });

  goals.data.forEach((g: Goal) => {
    calendar.createEvent({
      start: new Date(g.losedate * 1000),
      end: new Date(g.losedate * 1000),
      summary: `${g.slug}: ${g.limsum}`,
      description: `${g.title}\n${g.fineprint}`,
      url: `https://beeminder.com/${user}/${g.slug}`,
    });
  });

  response.set("Content-Type", "text/calendar");
  response.set(
      "Content-Disposition",
      `attachment; filename="${user}-beeminder-goals.ics"`
  );

  response.send(calendar.toString());
});
