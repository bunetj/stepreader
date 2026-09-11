import json, os, uuid, time
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
CHATS = os.path.join(ROOT, 'chats.json')
PORT = 51337

def load():
    if not os.path.exists(CHATS):
        return []
    with open(CHATS, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except Exception:
            return []

def save(data):
    with open(CHATS, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read(self):
        n = int(self.headers.get('Content-Length', 0))
        if not n:
            return {}
        return json.loads(self.rfile.read(n).decode('utf-8'))

    def _id_from_path(self):
        parts = self.path.split('/')
        return parts[-1] if len(parts) >= 4 else None

    def do_GET(self):
        if self.path == '/api/chats':
            return self._json(200, load())
        return super().do_GET()

    def do_POST(self):
        if self.path != '/api/chats':
            return self._json(404, {'error': 'not found'})
        data = self._read()
        chats = load()
        chat = {
            'id': str(uuid.uuid4()),
            'name': data.get('name', 'Untitled'),
            'mode': data.get('mode', 'telegram'),
            'text': data.get('text', ''),
            'settings': data.get('settings', {}),
            'chunks': data.get('chunks', []),
            'currentChunk': data.get('currentChunk', 0),
            'updatedAt': int(time.time()),
        }
        chats.append(chat)
        save(chats)
        return self._json(200, chat)

    def do_PUT(self):
        if not self.path.startswith('/api/chats/'):
            return self._json(404, {'error': 'not found'})
        cid = self._id_from_path()
        patch = self._read()
        chats = load()
        for c in chats:
            if c['id'] == cid:
                for k in ('name', 'mode', 'text', 'settings', 'chunks', 'currentChunk'):
                    if k in patch:
                        c[k] = patch[k]
                c['updatedAt'] = int(time.time())
                save(chats)
                return self._json(200, c)
        return self._json(404, {'error': 'no such chat'})

    def do_DELETE(self):
        if not self.path.startswith('/api/chats/'):
            return self._json(404, {'error': 'not found'})
        cid = self._id_from_path()
        chats = load()
        new = [c for c in chats if c['id'] != cid]
        if len(new) == len(chats):
            return self._json(404, {'error': 'no such chat'})
        save(new)
        return self._json(200, {'ok': True})

    def log_message(self, *a):
        pass

if __name__ == '__main__':
    print('server on http://localhost:%d' % PORT)
    HTTPServer(('127.0.0.1', PORT), H).serve_forever()