import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

type DateTime = string | number | dayjs.Dayjs | Date | null | undefined

export default {
  currentYear: () => dayjs().year(),
  currentDate: () => dayjs().format('YYYY-MM-DD'),
  currentTaipeiTime: (datetime: DateTime) => // 找到台北時區
    dayjs(datetime).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
  relativeTimeFromNow: (datetime: DateTime) => dayjs(datetime).fromNow()
}
