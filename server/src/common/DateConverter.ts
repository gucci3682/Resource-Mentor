export class DateConverter {
  public static UTCToSGT(utcDate: Date) {
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();
    const seconds = utcDate.getUTCSeconds();
    const milliseconds = utcDate.getUTCMilliseconds();
    
    const result = new Date(Date.UTC(year, month, day, hours + 8, minutes, seconds, milliseconds));
    return result;
  }

  public static getMonth(utcDate: Date) {
    const SGTDate = DateConverter.UTCToSGT(utcDate);
    console.log(SGTDate);
    return SGTDate.getMonth();
  }
}