# ryoProject

This workspace contains a Java Spring Boot backend and a React frontend (Vite).

Quick start

- Backend: build and run with Maven

```bash
cd backend
mvn spring-boot:run
```

- Frontend: install and start dev server

```bash
cd frontend
npm install
npm run dev
```

The frontend calls the backend API at `/api/hello` (proxying via same host during development).

Application startup

Backend only:

```bash
cd backend
mvn spring-boot:run
```

Frontend only:

```bash
cd frontend
npm install
npm run dev
```

Full local development (backend + frontend + MySQL):

```bash
docker-compose up --build
```

Docker (開発向け)

以下はソースをマウントしてコンテナ上で開発サーバーを動かす構成です（高速な再起動・変更反映を優先）。

```bash
docker-compose up --build
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:8080/api/hello


データベース（MySQL）

開発用 `docker-compose.yml` は MySQL サービスを含んでいます。起動するとデータベースが `ryodb` に作成され、初回起動時にバックエンドがサンプルデータ（`Alice`, `Bob`）を挿入します。

起動後の確認例:

```bash
# コンテナを起動
docker-compose up --build

# バックエンドが起動したら（ログ確認）
docker compose logs -f backend

# API でユーザー一覧を取得
curl http://localhost:8080/api/users
```

プロダクションイメージを作る場合はバックエンドの `Dockerfile` を使ってビルドします。


CI / GitHub Actions

このリポジトリには GitHub Actions のワークフローが含まれており、プルリクエストやプッシュ時にバックエンド（Maven）とフロントエンド（npm）のビルド、ならびに Docker イメージのビルドを自動で実行します。`main` ブランチへのプッシュでは設定に応じて GitHub Container Registry (ghcr.io) へイメージをプッシュします。

- ワークフローの確認: [.github/workflows/ci-build.yml](.github/workflows/ci-build.yml)

Publishing images to GitHub Container Registry (ghcr.io)

1. GitHub Actions を使う場合

- デフォルトではワークフローは `GITHUB_TOKEN` を使ってイメージをビルド・プッシュします。リポジトリのワークフロー内で `permissions: packages: write` が必要な場合があります。ワークフローは既にこのリポジトリ内にあるため、多くのケースでは追加のシークレットは不要です。

2. 手動でローカルからプッシュする場合 (必要なとき)

 - Personal Access Token (PAT) を作成し、`write:packages`（および必要なら `repo`）スコープを付与します。
 - PAT を `CR_PAT` のような名前で GitHub のリポジトリシークレットに保存するか、ローカルで利用します。

 例 (ローカルでの手順):

```bash
echo $CR_PAT | docker login ghcr.io -u ryoisbn4c0193-hue --password-stdin
docker build -t ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest ./backend
docker push ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest
```

3. 注意点

- ghcr にプッシュする場合、リポジトリや組織のパッケージ設定で `Read and write` の権限や、`GITHUB_TOKEN` でのパブリッシュを許可しているか確認してください。
- ワークフローで自動プッシュを有効にする際は、タグ付けルール（例: `v*` タグでのみパブリッシュ）やブランチ保護を検討してください。

必要なら、この README の説明にあなたの GitHub ユーザー名 / リポジトリ名を埋め込んだ具体例を追加します。どの方式で公開したいか教えてください。

具体例: ghcr へイメージをプッシュする（置換してください）

以下はローカルでイメージをビルドして `ghcr.io` にプッシュする具体例です。`YOUR_GITHUB_USERNAME` と `OWNER/REPO` を実際の値に置き換えてください。CI では `GITHUB_TOKEN` が代わりに使われます。

```bash
# ログイン（PAT を利用する場合）
echo $CR_PAT | docker login ghcr.io -u ryoisbn4c0193-hue --password-stdin

# バックエンドのイメージをビルドしてプッシュ
docker build -t ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest ./backend
docker push ghcr.io/ryoisbn4c0193-hue/ryoproject-backend:latest

# フロントエンド（静的ビルドや別名でビルドする場合）
docker build -t ghcr.io/ryoisbn4c0193-hue/ryoproject-frontend:latest ./frontend
docker push ghcr.io/ryoisbn4c0193-hue/ryoproject-frontend:latest
```

Docker デーモンの TCP (host.docker.internal:2375) を一時的に有効にする運用 — セキュリティ注意

このリポジトリの開発フローでは、devcontainer からホストの Docker デーモンに接続するために `DOCKER_HOST=tcp://host.docker.internal:2375` を使う運用を案内しています。TCP を有効化すると通信が暗号化されずにローカルネットワーク上で公開されるため、以下の点に注意してください。

- 推奨: 常時有効化は避け、必要なときだけ一時的に有効にしてください。作業が終わったら必ず無効化しましょう。
- 代替案: Docker ソケットを devcontainer にマウントする、または `docker context` の `ssh` を利用する（より安全）を検討してください。

Docker Desktop での一時有効化（Windows / macOS）:

1. Docker Desktop を開く
2. `Settings` / `Preferences` -> `General` を開く
3. `Expose daemon on tcp://localhost:2375 without TLS` をチェックして適用

有効化後、devcontainer や端末から以下を設定して接続できます。

Bash (Linux / devcontainer)

```bash
export DOCKER_HOST=tcp://host.docker.internal:2375
docker --version
docker compose version
docker ps

# 作業が終わったら
unset DOCKER_HOST
```

PowerShell (Windows)

```powershell
$env:DOCKER_HOST = 'tcp://host.docker.internal:2375'
docker --version
docker compose version

# 作業が終わったら
Remove-Item Env:\DOCKER_HOST
```

重要な注意事項:

- `tcp://...:2375` は TLS を使っていないため、ネットワーク上で盗聴や改ざんされるリスクがあります。信頼できないネットワークでは絶対に有効化しないでください。
- CI や自動化でホストへ接続する必要がある場合は、SSH ベースの `docker context` や、組織内の安全なビルドランナーを使うことを検討してください。

必要なら私の方で `README.md` の該当箇所にあなたの GitHub ユーザー名/リポジトリ名を埋めた具体例を入れます。差し替える値を教えてください。


