import React, { useEffect, useState } from 'react'
import '@fontsource/roboto'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

export default function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [userLoading, setUserLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const fetchHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBase}/api/hello`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setMessage(data.message)
    } catch (err) {
      setError('API に接続できませんでした。')
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUserLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBase}/api/users`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
      setSearchQuery('')
    } catch (err) {
      setError('ユーザー一覧の取得に失敗しました。')
      setUsers([])
      setFilteredUsers([])
    } finally {
      setUserLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setFilteredUsers(users)
  }

  useEffect(() => {
    fetchHello()
    fetchUsers()
  }, [])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb: 3 }}>
        <Tab label="ホーム" />
        <Tab label="ユーザー一覧" />
      </Tabs>

      {tabValue === 0 && (
        <Card elevation={6}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              ryoProject フロントエンド
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              このページは Material UI を使って構成されています。
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={fetchHello}>
                リロード
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={`${apiBase}/api/hello`}
                target="_blank"
                rel="noreferrer"
              >
                API を直接開く
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card elevation={6}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              ユーザー一覧
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                label="ユーザー名で検索"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <Button variant="contained" onClick={handleSearch}>
                検索
              </Button>
              <Button variant="outlined" onClick={handleClearSearch}>
                クリア
              </Button>
            </Box>

            {userLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  検索結果: {filteredUsers.length} / {users.length} 件
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          ID
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          ユーザー名
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell align="center">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                            ユーザーが見つかりません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
