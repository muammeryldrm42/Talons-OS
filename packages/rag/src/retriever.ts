export interface RetrievalChunk {
  id: string;
  score: number;
  text: string;
  source: string;
}

export async function retrieveRelevantChunks(query: string): Promise<RetrievalChunk[]> {
  void query;
  return [];
}
