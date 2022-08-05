import fs from 'fs'
import axios from 'axios'
import readline from 'readline'

const { EMAIL, PASSWORD, API_URL } = process.env

function login() {
  return axios
    .post(`${API_URL}/login`, {
      email: EMAIL,
      password: PASSWORD,
    })
    .then((res) => {
      return res.data.jwt.token
    })
    .catch((err) => {
      console.log('Login failed:', err)
      throw err
    })
}

async function sendRequest(path, data, token, method = 'post') {
  return axios({
    method,
    url: `${API_URL}/${path}`,
    data,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

function createSubmissionsFromTsv(data, token) {
  return Promise.all(
    Object.keys(data).map((key) => {
      const course = Object.keys(data[key])[0]
      if (course === undefined) {
        return Promise.resolve()
      }
      const exercise = Object.keys(data[key][course])[0]
      const firstFile = Object.keys(data[key][course][exercise])[0]
      const code = data[key][course][exercise][firstFile]
      const payload = {
        student_id: Math.floor(Math.random() * 2 + 1),
        course_id: 2,
        exercise_id: 4,
        code,
      }
      return sendRequest('submission', payload, token)
    })
  )
}

function readDataFromFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

function lineByLineReader(path) {
  return readline.createInterface({
    input: fs.createReadStream(path),
    console: false,
  })
}

function readSillyTsv(path) {
  const lineReader = lineByLineReader(path)
  const data = {}
  return new Promise((resolve, reject) => {
    lineReader.on('line', (line) => {
      const id = line.slice(0, 36).trim()
      const js = JSON.parse(line.slice(36))
      data[id] = js
    })
    lineReader.on('close', () => {
      resolve(data)
    })
  }).catch((err) => {
    console.log('readDataFromFile failed:', err)
  })
}

async function run() {
  const token = await login()
  const data = await readSillyTsv('./src/rainfall-submissions.tsv')
  const done = await createSubmissionsFromTsv(data, token)
  console.log('Test data created!')
}

run()
