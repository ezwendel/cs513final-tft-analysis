#  First Name      : Elijah
#  Last Name       : Wendel
#  Id              : 10436889
#  purpose         : running Techniques on TFT dataset 12.6B

# clear data
rm(list = ls())

# read in data
data <- read.csv("C://Users//elijah//Desktop//cs513final//finalDataALL//all_data.csv", na.strings="?")
data <- data[,-c(113,114)]
data[113]

most_important <- c(10, 28, 44, 194, 197, 175, 188, 147, 15, 18, 134, 185, 183, 165, 124, 164, 121, 32, 162, 14)
most_important <- most_important + 1
most_important <- c(most_important, 113)

data <- data[,most_important]



# converting top4 to factor
data$top4 <- factor(data$top4, labels=c("True","False"))
is.factor(data$top4)

# sample for training test split
set.seed(100)

idx<-sort(sample(nrow(data),as.integer(.7*nrow(data))))
training<-data[idx,]
test<-data[-idx,]

# load in c5.0 library
library('C50')

# use c5.0
C50_class <- C5.0( top4~.,data=training )

summary(C50_class )
# dev.off()
# plot(C50_class)
C50_predict<-predict( C50_class ,test , type="class" )
table(actual=test$top4,C50=C50_predict)
wrong<- (test$top4!=C50_predict)
c50_rate<-sum(wrong)/length(test$top4)
c50_rate

saveRDS(C50_class, "./413_ex_tree_c50.rds")
c50Model <- readRDS("./413_ex_tree_c50.rds")

# Check for overfitting
C50_predict<-predict( C50_class ,training , type="class" )
table(actual=training$top4,C50=C50_predict)
wrong<- (training$top4!=C50_predict)
c50_rate<-sum(wrong)/length(training$top4)
c50_rate

# CART

library(rpart)
library(rpart.plot)  			# Enhanced tree plots
library(rattle)           # Fancy tree plot
library(RColorBrewer)     # colors needed for rattle

# Make the tree using training data
CART_class<-rpart( top4~.,data=training)
rpart.plot(CART_class)
CART_predict<-predict(CART_class,test, type="class")
table(Actual=test$top4,CART=CART_predict)
CART_wrong<-sum(test$top4!=CART_predict)
CART_error_rate<-CART_wrong/length(test$top4)
CART_error_rate 

saveRDS(CART_class, "./413_ex_tree_CART.rds")
cartModel <- readRDS("./413_ex_tree_CART.rds")

# Check for Overfitting
CART_predict<-predict(CART_class,training, type="class")
table(Actual=training$top4,CART=CART_predict)
CART_wrong<-sum(training$top4!=CART_predict)
CART_error_rate<-CART_wrong/length(training$top4)
CART_error_rate 

# naive bayes

library(e1071)
library(class) 

nBayes_all <- naiveBayes(top4 ~., data =training)
category_all<-predict(nBayes_all,test)
table(NBayes_all=category_all,Class=test$top4)
NB_wrong<-sum(category_all!=test$top4)
NB_error_rate<-NB_wrong/length(category_all)
NB_error_rate

saveRDS(nBayes_all, "./413_ex_tree_nb.rds")
nbModel <- readRDS("./413_ex_tree_nb.rds")

# check for overfitting

category_all<-predict(nBayes_all,training)
table(NBayes_all=category_all,Class=training$top4)
NB_wrong<-sum(category_all!=training$top4)
NB_error_rate<-NB_wrong/length(category_all)
NB_error_rate

# KNN

library(kknn)

sqrt(nrow(training))
# 216
predict_k215 <- kknn(formula=top4~., training, test[,-21], k=215,kernel ="triangular" )
fit_k215 <- fitted(predict_k215)
table(Actual=test$top4,Fitted=fit_k215)
knn_wrong<-sum(fit_k215!=test$top4)
knn_error_rate<-knn_wrong/length(fit_k215)
knn_error_rate

saveRDS(predict_k215, "./413_ex_tree_knn.rds")
knnModel <- readRDS("./413_ex_tree_knn.rds")

# neural nets

library("neuralnet")
class(training$top4)
net_wisc_bc<- neuralnet( top4~. , data=training, hidden=2, threshold=0.3, linear.output = FALSE)

#Plot the neural network
plot(net_wisc_bc)

## test should have only the input columns
ann <-compute(net_wisc_bc , test[,-21])
ann$net.result 
length(ann$net.result)

ann_cat<-ifelse(ann$net.result <.5,'false','true')
length(ann_cat)

table(Actual=test$top4,prediction=ann_cat[,2])

wrong<- (test$top4!=ann_cat[,2])
error_rate<-sum(wrong)/length(wrong)
error_rate

saveRDS(net_wisc_bc, "./413_ex_tree_nn.rds")

model <- readRDS('./413_ex_tree_nn.rds')
