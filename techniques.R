#  First Name      : Elijah
#  Last Name       : Wendel
#  Id              : 10436889
#  purpose         : running Techniques on TFT dataset 12.6B

# clear data
rm(list = ls())

# read in data
data <- read.csv("C://Users//elijah//Desktop//cs513final//finalData//pca_data.csv", na.strings="?")

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
dev.off()
plot(C50_class)
C50_predict<-predict( C50_class ,test , type="class" )
table(actual=test$top4,C50=C50_predict)
wrong<- (test$top4!=C50_predict)
c50_rate<-sum(wrong)/length(test$top4)
c50_rate

# CART

library(rpart)
library(rpart.plot)  			# Enhanced tree plots
library(rattle)           # Fancy tree plot
library(RColorBrewer)     # colors needed for rattle

# Make the tree using training data
CART_class<-rpart( top4~.,data=training)
rpart.plot(CART_class)=
CART_predict<-predict(CART_class,test, type="class")
table(Actual=test$top4,CART=CART_predict)
CART_wrong<-sum(test$top4!=CART_predict)
CART_error_rate<-CART_wrong/length(test$top4)
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

# neural nets

library("neuralnet")
class(training$top4)
net_wisc_bc<- neuralnet( top4~. , hidden=2, threshold=0.01, linear.output = FALSE)

#Plot the neural network
plot(net_wisc_bc)

## test should have only the input columns
ann <-compute(net_wisc_bc , test[,-21])
ann$net.result 
length(ann$net.result)

ann_cat<-ifelse(ann$net.result <.5,'False','True')
length(ann_cat)

table(Actual=test$top4,prediction=ann_cat[,2])

wrong<- (test$top4!=ann_cat[,2])
error_rate<-sum(wrong)/length(wrong)
error_rate
