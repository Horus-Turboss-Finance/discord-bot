import moment from 'moment';
moment.locale('fr');

export function formatUptime(timestamp: number): string {
  return moment(timestamp).fromNow();
}