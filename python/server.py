""

import zerorpc
import gevent
import signal
import deeptrack as dt
from dtserver import PyAPI


port = 2734
print("Starting server...")
s = zerorpc.Server(PyAPI())
# Try to bind to a port between 2000 and 2999
for port in range(2000, 3000):
    print(port)
    try:
        addr = "tcp://127.0.0.1:" + str(port)
        s.bind(addr)
        gevent.signal(signal.SIGTERM, s.stop)
        gevent.signal(signal.SIGINT, s.stop)  # ^C
        s.run()
        break
    except Exception as e:
        print("ERROR: Failed to bind to port", port)
        print(e)
