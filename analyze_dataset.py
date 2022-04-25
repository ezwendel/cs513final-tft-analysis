import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.ensemble import ExtraTreesClassifier

dataset = pd.read_csv('./finalData/all_data.csv')

Y = dataset.iloc[:, 2]
X = dataset.iloc[:, 3:]

# print(Y)
# print(X)

extraTreesModel = ExtraTreesClassifier(n_estimators=100)

extraTreesModel.fit(X, Y)
importance = extraTreesModel.feature_importances_
# print(importance)
# print(sum(importance))
indexes = np.argpartition(importance, [-20])[-20:]
print(indexes)
top20 = importance[indexes]
print(top20)
print(sum(top20))

pcaModel = PCA(n_components=20)
pcaFit = pcaModel.fit(X)

print("Explained Variance: %s" % pcaFit.explained_variance_ratio_)
print("Explained Variance Sum: %s" % sum(pcaFit.explained_variance_ratio_))
print(pcaFit.components_)

X_pcaFit = pcaFit.transform(X)
df_pca = pd.DataFrame(X_pcaFit, columns=['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'PC8', 'PC9', 'PC10', 'PC11', 'PC12', 'PC13', 'PC14', 'PC15', 'PC16', 'PC17', 'PC18', 'PC19', 'PC20'])
df_pca['top4'] = Y
df_pca.head()

df_pca.to_csv('./finalData/pca_data.csv', index=False)