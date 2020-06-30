import {
  INgramParams, NgramModelId, IModelId, TokenSetType,
  ClusteringAlgoType, IDBSCANParams, IHDBSCANParams, IOPTICSParams, IKMeansParams,
  DimVisualizationType, ITSNEParams, IUMAPParams,
} from 'shared'

export interface IFormRefMethods<T> {
  executeSubmit: (defaultData?: any) => Promise<T>
  reset: (formData?: any) => void
}
export type ModelFormData = { 
  [NgramModelId]: INgramFormParams | undefined
}
export type ModelFormParams = INgramFormParams

export interface INgramFormParams {
  token_set: TokenSetType
  min_ngrams: number
  max_ngrams: number
  random_seed: number
  selected_clustering_algo: ClusteringAlgoType
  selected_dim_visualization: DimVisualizationType
  // This Required-Omit hack omits the name, and makes all the properties defined.
  // Otherwise the errors-object won't infer the maybe values eg. eps?: number
  DBSCAN: Required<Omit<IDBSCANParams, 'name'>>
  HDBSCAN: Required<Omit<IHDBSCANParams, 'name'>>
  OPTICS: Required<Omit<IOPTICSParams, 'name'>>
  KMeans: Required<Omit<IKMeansParams, 'name'>>
  TSNE: Required<Omit<ITSNEParams, 'name'>>
  UMAP: Required<Omit<IUMAPParams, 'name'>>
}
