import * as moment from "moment;";

export default {
  dateParse: function (rawDate) {
    return moment(rawDate).format("YYYY-MM-DD");
  },
};
