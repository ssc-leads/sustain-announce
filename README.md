# Instructions

```
curl -fsSL https://bun.sh/install | bash
bun i
bun run dev
bunx shadcn add table
bunx install reactemail

# for pulling in vars
bunx vercel link  # sign in here and link the right repo/project
bunx vercel env pull .env.development.local
```

# homepage description
- date: input field  for user to input date that the next announce should be sent out -> this should then filter submissions in the kv database to everything that should be in that digest's date
- text input for additional content: input field for user to add any additional text that will go in the top of the email
- flag all submissions that have "exceedsTwoConsectuveMondays" = True and "advertiseOnSSCInsta" = True for review (should show all fields in the UI with a checkbox? or maybe it's easier to just convert the json to a CSV for download and note which rows are flagged/how many submissions need to be manually reviewed)
- generate calendar links using this formula: https://www.google.com/calendar/render?action=TEMPLATE&text=%s&dates=%s/%s&details=%s&location=%s&trp=true&sprop&sprop=name:&pli=1&sf=true&output=xml', urlencode($row['title']), $start_time, $end_time, urlencode($row['description']), urlencode($row['location'])) 
- another example link with time zone (should be eastern): https://calendar.google.com/calendar/render?action=TEMPLATE&text=Example+Google+Calendar+Event&details=More+help+see:+https://support.google.com/calendar/thread/81344786&dates=20201231T160000/20201231T170000&recur=RRULE:FREQ%3DWEEKLY;UNTIL%3D20210603&ctz=America/Toronto 
- generate HTML that can be copied or downloaded (this can be almost an exact copy of the GSC anno html - but instead of categories it can be sorted by "Event", "Opportunity with Deadline" and "opportunity without deadline" at the top), and generate an ics/csv file to import to calendar
- example HTML and calendar csv in "/gsc-anno-examples" - this image (https://drive.google.com/file/d/1yGFc--ed1wTend_MZ0ekGOXeNktzNld8/view?usp=sharing) can be used instead of the GSC logo at the top

[href: https://drive.google.com/file/d/1yGFc--ed1wTend_MZ0ekGOXeNktzNld8/view?usp=sharing]
# Sustain Announce: [Inputted Date]
Sustain Announce is the [Student Sustainability Coalition's](ssc.mit.edu) weekly announcement email of sustainability-related events and opportunities sent to the  MIT community. [Click here]() to submit an announcement to be included in a future email or click here to access the Events Calendar, updated weekly.
if additional text submitted:
SSC Updates: [additionalText]

bunx shadcn add table
bunx install reactemail