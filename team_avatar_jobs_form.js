/**
* Script used to color a spreadsheet of FFXIV jobs. The expected format is:
* Unused column | Unused column | Job 1 | Job 2   | Job 3    | Unused column
* X             | X             | Ninja | Warrior | Red Mage |
*
* For users:
* Add this to a Spreadsheet by:
*  1) Creating a new Spreadsheet (or form to populate it)
*  2) Tools -> Script editor
*  3) Paste the script and save
* Reopening the spreadsheet will automatically color the job columns. Editing
* any column will also trigger colorization.
*
* For devs:
* The first row is the column labels, second row is where real data starts
* showing up. The columns with jobs are consecutive between [3, 5]. Change
* PRIMARY_JOB_RANGE_INDEX and NUM_JOB_COLUMNS to alter this behavior.
*/

/** All Dps jobs as of FFXIV Stormblood */
DPS_JOBS = [
  "Bard",
  "Black Mage",
  "Dragoon",
  "Machinist",
  "Monk",
  "Ninja",
  "Red Mage",
  "Samurai",
  "Summoner",
];

/** Red color for Dps */
DPS_COLOR = "#e74c3c";

/** All Healer jobs as of FFXIV Stormblood */
HEALER_JOS = [
  "Astrologian",
  "Scholar",
  "White Mage",
]

/** Green color for Healers */
HEALER_COLOR = "#2ecc71";

/** All Tank jobs as of FFXIV Stormblood */
TANK_JOBS = [
  "Dark Knight",
  "Paladin",
  "Warrior",
]

/** Blue color for Tanks */
TANK_COLOR = '#3498db';

/** Primary job starts at the 3rd column */
PRIMARY_JOB_RANGE_INDEX = 3;
NUM_JOB_COLUMNS = 3;

/**
* Called when the Spreadsheet is opened.
*
* After this function completes, cells within the range from [2, 3] to
* [lastRow, 5] will be colored appropriately.
*/
function onOpen() {
  Logger.log("onOpen");
  var sheet = SpreadsheetApp.getActiveSheet();
  var jobsRange = sheet.getRange(
      2, PRIMARY_JOB_RANGE_INDEX, sheet.getLastRow(), NUM_JOB_COLUMNS);
  _formatJobsRange(jobsRange);
}

/**
* Called after the user edits the Spreadsheet.
*
* After this function completes, the edited cell(s) will be colored
* appropriately. Note that this function does not check if the edited cell is
* within the appropriate range. That optimization can be added as needed.
*/
function onEdit(e) {
  Logger.log("onEdit");
  _formatJobsRange(e.range);
}

function _formatJobsRange(range) {
  Logger.log("_formatJobsRange, range: %s", range);
  var values = range.getValues();
  var newColors = new Array(values.length);
  for (var i = 0; i < values.length; ++i) {
    var row = values[i];
    newColors[i] = new Array(row.length);
    for (var j = 0; j < row.length; ++j) {
      if (_arrayContains(DPS_JOBS, row[j])) {
        newColors[i][j] = DPS_COLOR;
        continue;
      }
      if (_arrayContains(HEALER_JOS, row[j])) {
        newColors[i][j] = HEALER_COLOR;
        continue;
      }
      if (_arrayContains(TANK_JOBS, row[j])) {
        newColors[i][j] = TANK_COLOR;
        continue;
      }
    }
  }
  range.setFontColor("white");
  range.setBackgrounds(newColors);
}

// Apparently App Script doesn't have a proper array contains function
function _arrayContains(arr, e) {
  Logger.log("_arrayContains. arr: %s, e: %s", arr, e);
  for (var i = 0; i < arr.length; ++i) {
    var element = arr[i];
    if (element === e) {
      return true;
    }
  }
  return false;
}
