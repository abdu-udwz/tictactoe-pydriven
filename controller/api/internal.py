from requests import Session, exceptions
from urllib.parse import urljoin

session = Session()

session.headers.update({'accept': 'application/json'})

# important should not contain a trailing slash
BASE_URL = ''


def get(name):
    res = session.get(urljoin(BASE_URL, f'/_api/boards/{name}'))
    return res.json()


def create(name):
    res = session.post(urljoin(BASE_URL, f'/_api/boards'), json={'name': name})
    return res.json()


def update(name, matrix):
    try:
        res = session.patch(urljoin(BASE_URL, f'/_api/boards/{name}'), json={'matrix': matrix})
        return res.json()
    except exceptions.RequestException as err:
        print('There was an error sending update request, please check your connection')
        raise err


def reset(name):
    res = session.post(urljoin(BASE_URL, f'/_api/boards/{name}/reset'))
    return res.json()
