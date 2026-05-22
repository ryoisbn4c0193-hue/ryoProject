# ryoProject

このワークスペースは Java Spring Boot バックエンドと React (Vite) フロントエンドを含んでいます。

## 起動手順

### バックエンドのみ

```bash
cd backend
mvn spring-boot:run
```

### フロントエンドのみ

```bash
cd frontend
npm install
npm run dev
```

起動すると `http://localhost:5173` でアクセス可能です。

**フロントエンドの特徴:**
- **Material UI (MUI)** コンポーネントベースで、モダンな UI を実装
- 依存パッケージ: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@fontsource/roboto`
- **2 つのタブ機能:**
  - **ホーム**: バックエンド API (`/api/hello`) と連携し、メッセージを取得・表示
  - **ユーザー一覧**: ユーザーテーブルを検索・表示（Material UI テーブルコンポーネント使用）
- ユーザー一覧では、ユーザー名で検索・絞り込み可能

### フルローカル開発

```bash
docker-compose up --build
```

起動後の確認:
- **フロントエンド** (Material UI 使用): `http://localhost:5173`
- **バックエンド API**: `http://localhost:8080/api/hello`
- **ユーザー一覧 API**: `http://localhost:8080/api/users`

## アプリの再起動

### フロント・バックを個別に起動している場合

**フロントエンドを再起動:**
```bash
# ターミナル1: フロントエンドを停止（Ctrl+C）して再起動
cd frontend
npm run dev
```

**バックエンドを再起動:**
```bash
# ターミナル2: バックエンドを停止（Ctrl+C）して再起動
cd backend
mvn spring-boot:run
```

### Docker Compose で起動している場合

```bash
# 全サービスを停止
docker-compose down

# 再度起動（ビルドも実行）
docker-compose up --build
```

**または、コンテナのみリスタート:**
```bash
docker-compose restart
```

## 開発用 Docker

この構成では、ソースをコンテナにマウントして開発サーバーを動かします。変更が速く反映されるように設計されています。

```bash
docker-compose up --build
```

- **フロントエンド** (Material UI): http://localhost:5173
- **バックエンド**: http://localhost:8080/api/hello

## データベース（MySQL）

`docker-compose.yml` には MySQL サービスが含まれています。起動後、データベース `ryodb` が作成され、バックエンド起動時にサンプルデータとして `Alice` と `Bob` が挿入されます。

### API エンドポイント

- **`GET /api/hello`** - メッセージを返す
- **`GET /api/users`** - 全ユーザーを取得
- **`GET /api/users?search=<name>`** - ユーザー名で検索（部分一致、大文字小文字を区別しない）

### 起動後の確認例:

```bash
# コンテナを起動
docker-compose up --build

# バックエンドが起動したらログを確認
docker compose logs -f backend

# API でユーザー一覧を取得
curl http://localhost:8080/api/users

# ユーザー名で検索
curl http://localhost:8080/api/users?search=Alice
```

## プロダクションイメージ

バックエンドのプロダクションイメージを作成するには、`backend/Dockerfile` を使用してください。

## CI / GitHub Actions

このリポジトリには GitHub Actions のワークフローが含まれており、プルリクエストやプッシュ時にバックエンド（Maven）とフロントエンド（npm）のビルド、および Docker イメージのビルドを自動実行します。`main` ブランチへのプッシュでは、設定に応じて GitHub Container Registry (`ghcr.io`) へイメージをプッシュします。

- ワークフローの確認: [.github/workflows/ci-build.yml](.github/workflows/ci-build.yml)

### ghcr.io へのイメージ公開

#### GitHub Actions を使う場合

- デフォルトではワークフローが `GITHUB_TOKEN` を使用してイメージをビルドおよびプッシュします。
- リポジトリのワークフローで `permissions: packages: write` が必要になる場合があります。
- ほとんどの場合、追加のシークレットは不要です。

#### ローカルから手動でプッシュする場合（必要なとき）

1. GitHub の Personal Access Token (PAT) を作成し、`write:packages` と必要に応じて `repo` スコープを付与します。
2. PAT を `CR_PAT` などの環境変数または GitHub シークレットとして保存します。

例:

```bash
echo $CR_PAT | docker login ghcr.io -u ryoisbn4c0193-hue --password-stdin
docker build -t ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest ./backend
docker push ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest
```

#### 注意点

- ghcr にプッシュする場合、リポジトリや組織のパッケージ設定で `Read and write` 権限が有効か確認してください。
- 自動プッシュを有効にする場合は、タグ付けルール（例: `v*` タグのみ）やブランチ保護の運用を検討してください。

## Docker デーモン TCP 接続のセキュリティ

このリポジトリでは、devcontainer からホストの Docker デーモンに接続するために `DOCKER_HOST=tcp://host.docker.internal:2375` を使用する運用を案内しています。TCP を有効化すると通信が暗号化されないため、以下に注意してください。

- 常時有効化は避け、必要なときだけ有効にしてください。
- 作業が終わったら無効化してください。
- 代替として、Docker ソケットのマウントや `docker context` の `ssh` を検討するとより安全です。

### Docker Desktop での一時有効化（Windows / macOS）

1. Docker Desktop を開く
2. `Settings` / `Preferences` の `General` を開く
3. `Expose daemon on tcp://localhost:2375 without TLS` を有効化して適用

### 有効化後の接続設定

#### Bash (Linux / devcontainer)

```bash
export DOCKER_HOST=tcp://host.docker.internal:2375
docker --version
docker compose version
docker ps

# 作業が終わったら
unset DOCKER_HOST
```

#### PowerShell (Windows)

```powershell
$env:DOCKER_HOST = 'tcp://host.docker.internal:2375'
docker --version
docker compose version

# 作業が終わったら
Remove-Item Env:\DOCKER_HOST
```

### セキュリティ注意

- `tcp://...:2375` は TLS を使用していないため、盗聴や改ざんのリスクがあります。
- 信頼できないネットワークでは絶対に有効化しないでください。
- CI や自動化でホスト接続が必要な場合は、SSH ベースの `docker context` や安全なビルドランナーの利用を検討してください。


