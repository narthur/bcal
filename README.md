# bcal

Beeminder iCal generator.

## Usage

Use the following URL structure to access your calendar:

```
https://us-central1-beeminder-ical.cloudfunctions.net/calendar?user=<username>&token=<token>
```

You can find your Beeminder username and token at the following URL:

```
https://www.beeminder.com/api/v1/auth_token.json
```

### Google Calendar

- Navigate to Google Calendar.
- In the left sidebar, click the `+` icon next to "Other calendars."
- From the dropdown menu, select "From URL."
- Paste in your URL as shown above, with your username and token.
- Click "Add calendar."

Google Calendar may only re-sync every few hours.

### Outlook Calendar

- Navigate to http://calendar.live.com
- In the left sidebar, click "Add calendar."
- In the modal sidebar, click "Subscribe from web."
- Paste in your URL as shown above, with your username and token.
- Set the title, etc., as desired.
- Click "Import."

The calendar should now show up both in your Outlook calendar on web, and in the
Windows Calendar app.
