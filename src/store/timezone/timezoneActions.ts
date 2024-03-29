import { Action, ActionCreator} from "redux";
import { ThunkAction } from "redux-thunk";
import { api, getListClock } from "../../utils/utils";
import { updateListClock } from "../listClock/listClockAction";
import { ITimezone, TimezoneState} from "./timezoneReducer";

export type TimezoneAction = TimezoneRequestAction | TimezoneRequestSuccessAction | TimezoneRequestErrorAction;

export const TIMEZONE_REQUEST = 'TIMEZONE_REQUEST';
export type TimezoneRequestAction = {
  type: typeof TIMEZONE_REQUEST,
}

export const timezoneRequest: ActionCreator<TimezoneRequestAction> = () => ({
  type: TIMEZONE_REQUEST,
})


export const TIMEZONE_REQUEST_SUCCESS = 'TIMEZONE_REQUEST_SUCCESS';
export type TimezoneRequestSuccessAction = {
  type: typeof TIMEZONE_REQUEST_SUCCESS,
  data: Array<ITimezone>,
}

export const timezoneRequestSuccess: ActionCreator<TimezoneRequestSuccessAction> = (data) => ({
  type:TIMEZONE_REQUEST_SUCCESS,
  data,
})

export const TIMEZONE_REQUEST_ERROR = 'TIMEZONE_REQUEST_ERROR';
export type TimezoneRequestErrorAction = {
  type: typeof TIMEZONE_REQUEST_ERROR,
  error: string,
}

export const timezoneRequestError : ActionCreator<TimezoneRequestErrorAction> = (error) => ({
  type: TIMEZONE_REQUEST_ERROR,
  error,
})

export interface ITimeZoneApiDate {
  name: string,
  timezone: string,
}
export const timezoneRequestAsync = () : ThunkAction<void, TimezoneState, unknown, Action<string>> => (dispatch) => {
  dispatch(timezoneRequest());
  api<Array<ITimeZoneApiDate>>('https://clock-pied.vercel.app/timezone.json')
  .then(data => {
    setTimeout(()=>dispatch(timezoneRequestSuccess(data)),2000);
    return data[0];
  })
  .then(firstItem => dispatch(updateListClock(getListClock(firstItem, 2)))
  )
  .catch(error => dispatch(timezoneRequestError(error.toString())))
}