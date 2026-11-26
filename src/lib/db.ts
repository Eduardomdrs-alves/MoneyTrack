import mongoose from "mongoose";

/**
 * Conexão com o MongoDB Atlas usando o padrão Singleton.
 *
 * Em desenvolvimento o Hot Reload reexecuta os módulos a cada alteração e,
 * em produção (serverless/Vercel), cada invocação pode reaproveitar o mesmo
 * processo. Guardar a conexão (e a promise em andamento) no objeto `global`
 * garante que exista UMA única conexão por processo, evitando estourar o
 * limite de conexões do cluster.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

const DEFAULT_DB_NAME = "moneytrack";

/** true quando a URI já traz o nome do banco: mongodb+srv://host/NOME?opcoes */
function hasDatabaseName(uri: string): boolean {
  return /^mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);
}

export async function connectDB(): Promise<typeof mongoose> {
  // 1. Já existe conexão aberta -> reutiliza
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("A variável de ambiente MONGODB_URI não foi definida (.env.local).");
  }

  // 2. Nenhuma conexão em andamento -> cria uma (apenas uma vez)
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      // Se a URI não indicar o banco (".../?retryWrites"), usa "moneytrack" em vez do padrão "test"
      ...(hasDatabaseName(uri) ? {} : { dbName: DEFAULT_DB_NAME }),
    });
  }

  // 3. Aguarda a conexão; se falhar, limpa a promise para tentar de novo depois
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
