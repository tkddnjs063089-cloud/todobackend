# Todo Backend

Express + Prisma 6 기반 Todo 백엔드 API

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 `.env`로 복사하고 데이터베이스 연결 정보를 입력하세요:

```env
# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"

# MySQL
DATABASE_URL="mysql://username:password@localhost:3306/todo_db"

# SQLite
DATABASE_URL="file:./dev.db"
```

### 3. Prisma 설정
```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate
```

### 4. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm start
```

## API 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | 헬스 체크 |
| GET | `/todos` | 모든 Todo 조회 |
| GET | `/todos/:id` | 특정 Todo 조회 |
| POST | `/todos` | Todo 생성 |
| PUT | `/todos/:id` | Todo 수정 |
| DELETE | `/todos/:id` | Todo 삭제 |

## DBeaver 연동

1. DBeaver에서 사용하는 데이터베이스 연결 정보를 `.env` 파일에 입력
2. `prisma/schema.prisma`에서 `provider`를 사용하는 DB에 맞게 변경:
   - PostgreSQL: `postgresql`
   - MySQL: `mysql`
   - SQLite: `sqlite`
   - SQL Server: `sqlserver`
3. 마이그레이션 실행 후 DBeaver에서 테이블 확인 가능

