import agenda from 'agenda';
import mongoose from 'mongoose'; //may not be necessary
import { DB_URI } from './polysrc_config';
import { Story } from '../models/Story';
import { Channel } from '../models/Channel';
import { updateLastBuildDate, fetchFeeds } from './tasks';

export function configureAgenda(socket = null) {
  let agenda = new Agenda({db: {address: DB_URI}});
  agenda.define('update-feeds', (job, done) => {
    fetchFeeds();
    done();
  });
}
