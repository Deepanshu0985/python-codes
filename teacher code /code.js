const admDS = "Deepanshu";
const batDS = "Deepanshu";
const menDS = "Deepanshu";

const urlSS = "https://docs.google.com/spreadsheets/d/1tBXAc6B3gNDVFd1F8UMCLwkeDNQcyjAGp8p1Mr8ov2Y/edit?gid=0#gid=0";
const usrData = SpreadsheetApp.openByUrl(urlSS).getSheetByName("Teacher Data").getRange("A:C").getValues().filter(row => row.some(cell => (cell.length > 2)));

function doGet() {
  return HtmlService.createHtmlOutputFromFile('main').setTitle("1 to 1 Teacher - Student Interaction");
}

async function initHash(hash) {
  let teacherCode = "☠ Wrong Link ☠";
  let allocatedBatches = "☠ Wrong Link ☠";
  if (hash.length < 2) return {"teacherCode": teacherCode, "allocatedBatches": allocatedBatches};
  usrData.forEach(([teacher_code, batchData, code], i) => {
    if (i > 0) {
      if (code === hash) {
        teacherCode = teacher_code;
        allocatedBatches = batchData;
      }
    }
  });
  let qStr = `WITH student_table AS (
    SELECT
            s.slot_uid AS slot_uid,
            m.meeting_uid AS meeting_uid,
            m.roll_no AS roll_no,
            m.meeting_remarks AS meeting_remarks,
            adm.st_name AS st_name,
            m.meeting_date AS slot_date,
            FORMAT_TIME('%H:%M', m.meeting_st_time) || ' - ' || 
            FORMAT_TIME('%H:%M', TIME_ADD(m.meeting_st_time, INTERVAL 20 MINUTE)) AS \`interval\`
        FROM btdata.${menDS}.meeting_data m
        JOIN btdata.${menDS}.slot_data s
            ON m.teacher = s.teacher
            AND m.meeting_date = s.slot_date
        LEFT JOIN \`${admDS}.adm_data\` adm
            ON m.roll_no = adm.roll_no
        WHERE s.teacher = '${teacherCode}'
    ), batch_names AS (
    SELECT 
            b.name AS batch_name,
            bsl.student_roll_no AS roll_no
        FROM btdata.${batDS}.batch_student_link bsl 
        LEFT JOIN btdata.${batDS}.batches b
            ON bsl.batch_uid = b.uid
        WHERE bsl.deallocation_date is null and bsl.student_roll_no IN (SELECT roll_no FROM student_table)
    )
    SELECT sd.slot_uid AS \`Slot UID\`, sd.slot_date AS \`Date\`, FORMAT_TIME('%H:%M', sd.slot_st_time)  || ' - ' || FORMAT_TIME('%H:%M', TIME_ADD(sd.slot_st_time, INTERVAL 210 MINUTE)) AS \`Slot\`, JSON_VALUE(sd.zoom_details, '$.link') AS \`Zoom Link\`, JSON_VALUE(sd.zoom_details, '$.meetingID') AS \`Meeting ID\`, JSON_VALUE(sd.zoom_details, '$.password') AS \`Password\`, st.meeting_uid AS \`Meeting UID\`, st.roll_no AS \`Roll No\`, st.st_name AS \`Student Name\`, bn.batch_name AS \`Batch\`, st.interval AS \`Meeting Interval\`, st.meeting_remarks AS \`Meeting Remarks\` FROM \`${menDS}.slot_data\` sd LEFT JOIN student_table st ON (sd.slot_uid = st.slot_uid) LEFT JOIN batch_names bn ON (st.roll_no = bn.roll_no) WHERE teacher = '${teacherCode}' AND sd.slot_date >= CURRENT_DATE() ORDER BY sd.slot_date, sd.slot_st_time, st.interval;`

  let meetingDataOfTeacher = await BQLib.search("btdata", qStr)
  // Logger.log(qStr);
  // Logger.log(meetingDataOfTeacher);
  return {"teacherCode": teacherCode, "allocatedBatches": allocatedBatches, "meetingDataOfTeacher": meetingDataOfTeacher};
}

function updateMeetingRemarks(meetingUID, text){
  let qStr = `UPDATE btdata.${menDS}.meeting_data SET meeting_remarks = '${text.replace(/\r?\n/g, "\\n").replace(/'/g, "\\'")}' WHERE meeting_uid = '${meetingUID}'`;
  return BQLib.runQuery("btdata", qStr);
}

function test(){
  // Logger.log(JSON.stringify(teacherBatchJSON));
  Logger.log(getTimeSlotData("C25288788", "Wizards", "P"));
}

function convertDateToISO(dateString) {
  // Remove "th", "st", "nd", "rd" from the day part
  let cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");

  // Convert the cleaned date string into a JavaScript Date object
  let dateObj = new Date(cleanedDate);

  // Format the date into yyyy-mm-dd
  let yyyy = dateObj.getFullYear();
  let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  let dd = String(dateObj.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

function generateMeetingUID(entry_ts, mentor_uid) {
  // Convert entry_ts to string and concatenate with mentor_uid
  const inputString = entry_ts + mentor_uid;

  // Generate SHA-256 hash
  const hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, inputString);
  
  // Convert the hash bytes to a hex string
  const hash = hashBytes.map(byte => {
    const hex = (byte & 0xFF).toString(16);
    return (hex.length === 1 ? '0' : '') + hex;
  }).join('');

  return hash;
}

function getEntryTS_() {
  let x = new Date();

  let entry_timestamp = x.toLocaleString("en-IN", { "year": "numeric" })
    + "-"
    + x.toLocaleString("en-IN", { "month": "2-digit" })
    + "-"
    + x.toLocaleString("en-IN", { "day": "2-digit" })
    + " "
    + (x.toLocaleString("en-IN", { "hour": "2-digit", "hour12": false }))
    + ":"
    + (x.toLocaleString("en-IN", { "minute": "2-digit" }) < 10 ? "0"
      + x.toLocaleString("en-IN", { "minute": "2-digit" }) : x.toLocaleString("en-IN", { "minute": "2-digit" }))
    + ":"
    + (x.toLocaleString("en-IN", { "second": "2-digit" }) < 10 ? "0"
      + x.toLocaleString("en-IN", { "second": "2-digit" }) : x.toLocaleString("en-IN", { "second": "2-digit" }))
    + "+05:30";
  
  return entry_timestamp;
}






async function initHash(hash) {
  let batch_name = "";
    if (hash.length < 2) {
    return { "rollNo": rollNumber, "st_name": student_name };
  }


  // Get student data from BigQuery
  let stData = await BQLib.search(
    "btdata",
    `SELECT adm.roll_no, adm.st_name, b.name
      FROM ${admDS}.enq_data enq
      LEFT JOIN ${admDS}.adm_data adm
          ON enq.ent_roll_no = adm.ent_roll_no
      LEFT JOIN ${batDS}.batch_student_link bl
          ON adm.roll_no = bl.student_roll_no
      LEFT JOIN ${batDS}.batches b
          ON bl.batch_uid = b.uid
      WHERE enq.hash = '${hash}'
        AND bl.deallocation_date IS NULL`
  );


  rollNumber = stData?.[1]?.[0] || "☠ Wrong Link ☠";
  student_name = stData?.[1]?.[1] || "☠ Wrong Link ☠";
  const text = stData?.[1]?.[2]?.toString() || '';
    const match = text.match(/WOW|Wizards|COC|Champions/)?.[0];
  batch_name = match ? match : 'Champions';


  let dateCol = 1;
  let qStr = `SELECT
        m.teacher AS Teacher,
        m.meeting_date AS Date,
        FORMAT_TIME('%H:%M', m.meeting_st_time) || ' - ' ||
        FORMAT_TIME('%H:%M', TIME_ADD(m.meeting_st_time, INTERVAL 20 MINUTE)) AS Time,
        JSON_VALUE(s.zoom_details, '$.link') AS \`Zoom Link\`,
        JSON_VALUE(s.zoom_details, '$.meetingID') AS \`Meeting ID\`,
        JSON_VALUE(s.zoom_details, '$.password') AS \`Password\`,
        case when m.isActive then 'Scheduled' else 'Cancelled' end as \`Status\`
      FROM \`btdata.${menDS}.meeting_data\` m
      LEFT JOIN \`btdata.${menDS}.slot_data\` s
          ON m.teacher = s.teacher
          AND m.meeting_date = s.slot_date
      WHERE m.roll_no = '${rollNumber}';`
  // Logger.log(qStr);
  let meetingDataOfStudent = await BQLib.search("btdata", qStr);


  if (meetingDataOfStudent) {
    for (let i = 1; i < meetingDataOfStudent.length; i++) {
      meetingDataOfStudent[i][dateCol] = formattingDate(meetingDataOfStudent[i][dateCol]);
    }
  }


  slotData = getTimeSlotData(batch_name, rollNumber);


  Logger.log({
    "rollNo": rollNumber,
    "st_name": student_name,
    "batch": batch_name,
    "meetingDataOfStudent": meetingDataOfStudent,
    "slotData": slotData
    
  });


  return {
    "rollNo": rollNumber,
    "st_name": student_name,
    "batch": batch_name,
    "meetingDataOfStudent": meetingDataOfStudent,
    "slotData": slotData
  };
}




data: [["user_name","user_details","user_hash"],["P06","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","RORYI73758"],["P20","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","JKRCF47603"],["P14","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","KBILX02060"],["C07","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","FIXWC50303"],["C06","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","AUUUE97907"],["C19","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","XODLO15986"],["P15","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","VAKGN27853"],["C16","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","PEFQI13482"],["C12","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","FJPZR76344"],["P23","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","ZIMCO16088"],["P04","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","ZPYFB62302"],["P08","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","HVDNQ19059"],["P10","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","ILTLG18447"],["P07","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","XDMCI65023"],["P18","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","SHSWV32431"],["C01","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","GZQGY09839"],["P03","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","LHNOU03850"],["P09","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","ECMXK55057"],["C18","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","HDMGH36605"],["P11","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","DPFGB46452"],["C03","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","RUWTD64425"],["P25","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","NTVEF52485"],["P05","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","KLHQI69489"],["C14","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","HABTO61852"],["P16","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","NPONO95013"],["C10","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","RVKSN79668"],["C04","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","OBASU67062"],["C13","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","UTKPA52748"],["C05","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","JRHJR06511"],["P02","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","GGHJO03157"],["P27","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","BZKUA78352"],["C11","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","NAWLT99532"],["C17","[\"WOW\",\"Wizards\",\"COC\",\"Champions\"]","CXRNJ49158"]]
async function initHash(hash) {
  // Logger.log(usrData)
  const usrdata = await fetchUsrDataFromBigQuery();
  Logger.log(usrdata)
  


  let teacherCode = "☠ Wrong Link ☠";
  let allocatedBatches = "☠ Wrong Link ☠";
  if (hash.length < 2) return {"teacherCode": teacherCode, "allocatedBatches": allocatedBatches};
  usrData.forEach(([user_name, user_details, user_hash], i) => {
    if (i === 0) return; // skip header row

    if (user_hash === hash) {
      teacherCode = user_name;
      allocatedBatches = user_details;  // this is already an array
    }
  });

  Logger.log("teacherCode: " + teacherCode);
  Logger.log("allocatedBatches: " + JSON.stringify(allocatedBatches));
  // usrData.forEach(([teacher_code, batchData, code], i) => {
  //   if (i > 0) {
  //     if (code === hash) {
  //       teacherCode = teacher_code;
  //       allocatedBatches = batchData;
  //     }
  //   }
  // });
  // let qStr = `WITH student_table AS (
  //   SELECT
  //           s.slot_uid AS slot_uid,
  //           m.meeting_uid AS meeting_uid,
  //           m.roll_no AS roll_no,
  //           m.meeting_remarks AS meeting_remarks,
  //           adm.st_name AS st_name,
  //           m.meeting_date AS slot_date,
  //           FORMAT_TIME('%H:%M', m.meeting_st_time) || ' - ' || 
  //           FORMAT_TIME('%H:%M', TIME_ADD(m.meeting_st_time, INTERVAL 20 MINUTE)) AS \`interval\`
  //       FROM btdata.${menDS}.meeting_data m
  //       JOIN btdata.${menDS}.slot_data s
  //           ON m.teacher = s.teacher
  //           AND m.meeting_date = s.slot_date
  //       LEFT JOIN \`${admDS}.adm_data\` adm
  //           ON m.roll_no = adm.roll_no
  //       WHERE s.teacher = '${teacherCode}' and s.isActive 
  //   ), batch_names AS (
  //   SELECT 
  //           b.name AS batch_name,
  //           bsl.student_roll_no AS roll_no
  //       FROM btdata.${batDS}.batch_student_link bsl 
  //       LEFT JOIN btdata.${batDS}.batches b
  //           ON bsl.batch_uid = b.uid
  //       WHERE bsl.deallocation_date is null and bsl.student_roll_no IN (SELECT roll_no FROM student_table)
  //   )
  //   SELECT sd.slot_uid AS \`Slot UID\`, sd.slot_date AS \`Date\`, FORMAT_TIME('%H:%M', sd.slot_st_time)  || ' - ' || FORMAT_TIME('%H:%M', TIME_ADD(sd.slot_st_time, INTERVAL 210 MINUTE)) AS \`Slot\`, JSON_VALUE(sd.zoom_details, '$.link') AS \`Zoom Link\`, JSON_VALUE(sd.zoom_details, '$.meetingID') AS \`Meeting ID\`, JSON_VALUE(sd.zoom_details, '$.password') AS \`Password\`, st.meeting_uid AS \`Meeting UID\`, st.roll_no AS \`Roll No\`, st.st_name AS \`Student Name\`, bn.batch_name AS \`Batch\`, st.interval AS \`Meeting Interval\`, st.meeting_remarks AS \`Meeting Remarks\` FROM \`${menDS}.slot_data\` sd LEFT JOIN student_table st ON (sd.slot_uid = st.slot_uid) LEFT JOIN batch_names bn ON (st.roll_no = bn.roll_no) WHERE teacher = '${teacherCode}' AND sd.slot_date >= CURRENT_DATE() and sd.isActive ORDER BY sd.slot_date, sd.slot_st_time, st.interval;`

  let qStr = `WITH student_table AS (
    SELECT
        s.slot_uid AS slot_uid,
        m.meeting_uid AS meeting_uid,
        m.roll_no AS roll_no,
        m.meeting_remarks AS meeting_remarks,
        adm.st_name AS st_name,
        m.meeting_date AS slot_date,
        FORMAT_TIME('%H:%M', m.meeting_st_time) || ' - ' || 
        FORMAT_TIME('%H:%M', TIME_ADD(m.meeting_st_time, INTERVAL 20 MINUTE)) AS \`interval\`
        FROM btdata.${menDS}.meeting_data m
        JOIN btdata.${menDS}.slot_data s
            ON m.teacher = s.teacher
            AND m.meeting_date = s.slot_date
        LEFT JOIN \`${admDS}.adm_data\` adm
            ON m.roll_no = adm.roll_no
        WHERE s.teacher = '${teacherCode}'
          AND s.isActive
          AND m.isActive
    ), 
    batch_names AS (
        SELECT 
            b.name AS batch_name,
            bsl.student_roll_no AS roll_no
        FROM btdata.${batDS}.batch_student_link bsl 
        LEFT JOIN btdata.${batDS}.batches b
            ON bsl.batch_uid = b.uid
        WHERE bsl.deallocation_date IS NULL
          AND bsl.student_roll_no IN (SELECT roll_no FROM student_table)
    )
    SELECT 
        sd.slot_uid AS \`Slot UID\`,
        sd.slot_date AS \`Date\`,
        FORMAT_TIME('%H:%M', sd.slot_st_time) || ' - ' || FORMAT_TIME('%H:%M', TIME_ADD(sd.slot_st_time, INTERVAL 210 MINUTE)) AS \`Slot\`,
        JSON_VALUE(sd.zoom_details, '$.link') AS \`Zoom Link\`,
        JSON_VALUE(sd.zoom_details, '$.meetingID') AS \`Meeting ID\`,
        JSON_VALUE(sd.zoom_details, '$.password') AS \`Password\`,
        st.meeting_uid AS \`Meeting UID\`,
        st.roll_no AS \`Roll No\`,
        st.st_name AS \`Student Name\`,
        bn.batch_name AS \`Batch\`,
        st.interval AS \`Meeting Interval\`,
        st.meeting_remarks AS \`Meeting Remarks\`
    FROM \`${menDS}.slot_data\` sd
    JOIN student_table st
        ON sd.slot_uid = st.slot_uid
    LEFT JOIN batch_names bn 
        ON st.roll_no = bn.roll_no
    WHERE sd.teacher = '${teacherCode}'
      AND sd.slot_date >= CURRENT_DATE()
      AND sd.isActive
    ORDER BY sd.slot_date, sd.slot_st_time, st.interval;`


  let meetingDataOfTeacher = await BQLib.search("btdata", qStr)
  // Logger.log(qStr);
  // Logger.log(meetingDataOfTeacher);
  Logger.log("teacher code"+teacherCode )
  Logger.log("allocated batch"+ allocatedBatches )
  // Logger.log(""+ meetingDataOfTeacher)
  return {"teacherCode": teacherCode, "allocatedBatches": allocatedBatches, "meetingDataOfTeacher": meetingDataOfTeacher};
}
