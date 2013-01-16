"""
Functions that interact with the testing database.
"""

import os
import sqlite3
import zlib
import datetime

CFG_DIR = os.path.abspath(os.path.dirname(__file__))

class DBWrapper(object):
    def __init__(self, path):
        print 'connecting...'
        self._connection = sqlite3.connect(path)
        print 'connection established'
        print 'connection = ',str(self._connection)

    def query(self, sql):
        print 'query = ',sql
        reply = []
        cur = self._connection.cursor()
        cur.execute(sql)
        for tup in cur:
            reply.append(tup)
        return reply

    def insert(self, table, **kwargs):
        print 'inserting into table %s' % table
        cur = self._connection.cursor()
        sql = 'insert into %s%s values (%s)' % (table, 
                                                tuple(kwargs.keys()), 
                                                ','.join(['?']*len(kwargs)))
        cur.execute(sql, tuple(kwargs.values()))


# class Storage(object):
#     def __init__(self, **kwargs):
#         for k,v in kwargs.items():
#             setattr(self, k, v)

# db = web.database(dbn='sqlite', 
#                   db=os.path.join(CFG_DIR,'testdb'))

db = DBWrapper(os.path.join(CFG_DIR, 'testdb'))
            
def test_to_dct(tup):
    return dict(commit_id=tup[0],
                   host=tup[1],
                   passes=tup[2],
                   fails=tup[3],
                   skips=tup[4],
                   elapsed_time=tup[5],
                   platform=tup[6],
                   doc_results=tup[7],
                   date=tup[8])
    
# CREATE TABLE tests (
#    id INTEGER PRIMARY KEY,
#    commit_id TEXT,
#    host TEXT,
#    passes INTEGER,
#    fails INTEGER,
#    skips INTEGER,
#    elapsed_time TEXT,
#    platform TEXT,
#    results BLOB,
#    doc_results TEXT,
#    date TEXT
# );

def get_commits():
    print 'in get_commits'
    commits = []
    commitdict = {}
    tests = db.query('SELECT commit_id, date, fails, passes, doc_results from tests order by date DESC')
    for commit_id, tdate, fails, passes, doc_results in tests:
        if commit_id in commitdict:
            obj = commitdict[commit_id]
        else:
            obj = dict(passes=0, fails=0, skips=0,
                          commit_id=commit_id, date=tdate)
            commits.append(obj)
            commitdict[commit_id] = obj

            dct = get_docbuild(commit_id)
            if isinstance(dct['results'], basestring):
                result = dct['results']
            elif dct['results'] is not None:
              try:
                 result = zlib.decompress(dct['results'])
              except:
                 result = '?'
            if 'success' in result:
                obj['doc_results'] = 'YES'
            elif result == '?':
                obj['doc_results'] = result
            else:
                obj['doc_results'] = 'NO'
            
        if fails > 0 or passes == 0:
            obj['fails'] += 1
        else:
            obj['passes'] += 1
            
    return commits


def get_commit(commit_id):
    print 'in get_commit'
    try:
        tests = db.query("SELECT commit_id,host,passes,fails,skips,elapsed_time,platform,doc_results,date from tests where commit_id='%s'" % commit_id)
        return [test_to_dct(test) for test in tests]
    except IndexError as err:
        print str(err)
        return None


def get_test(host, commit_id):
    try:
        test = db.query("SELECT commit_id,doc_results,results from tests WHERE commit_id='%s' and host='%s'" % (commit_id, host))[0]
    except IndexError as err:
        print str(err)
        return None
    return dict(commit_id=test[0], doc_results=test[1], results=test[2])

def new_test(commit_id, results, host, 
             passes=0, fails=0, skips=0, elapsed_time='unknown'):
    db.insert('tests', id=None, commit_id=commit_id, results=sqlite3.Binary(results), 
              date=datetime.datetime.utcnow(),
              host=host, passes=passes, fails=fails, skips=skips,
              elapsed_time=elapsed_time)
    
def get_docbuild(commit_id):
    try:
        result = db.query("SELECT * from docbuilds WHERE commit_id='%s'" % commit_id)[0]
    except IndexError as err:
        print str(err)
        result = [commit_id, str(err)]
    return dict(commit_id=result[0], results=result[1])


def new_doc_info(commit_id, results):
    db.insert('docbuilds', commit_id=commit_id, results=sqlite3.Binary(zlib.compress(results,9)))

    
def delete_test(commit_id):
    db.delete('tests', where="commit_id=$commit_id", vars=locals())
    db.delete('docbuilds', where="commit_id=$commit_id", vars=locals())


def dump():
    print 'Tests:'
    tests = db.select('tests', order='date DESC')
    for test in tests:
        print "%s  %s  p:%s  f:%s  s:%s t:%s plat:%s date:%s" % (test.commit_id,
                                                                 test.host,
                                                                 test.passes,
                                                                 test.fails,
                                                                 test.skips,
                                                                 test.elapsed_time,
                                                                 test.platform,
                                                                 test.date)

    print 'Docbuilds:'
    tests = db.select('docbuilds')
    for test in tests:
        print "%s  %s" % (test.commit_id, test.results[0:50])
        


