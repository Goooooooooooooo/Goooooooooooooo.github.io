##### 用Java8中的“Function”消灭if...else！

在开发过程中经常会使用if...else...进行判断抛出异常、分支处理等操作。这些if...else...充斥在代码中严重影响了代码代码的美观，这时我们可以利用Java 8的Function接口来消灭if...else...。 


### Function 函数式接口

使用注解@FunctionalInterface标识，并且只包含一个抽象方法的接口是函数式接口。函数式接口主要分为Supplier供给型函数、Consumer消费型函数、Runnable无参无返回型函数和Function有参有返回型函数。

❝ Function可以看作转换型函数。❞


#### Supplier供给型函数

`Supplier` 的表现形式为不接受参数、只返回数据。

```java
/**
* 代表结果的提供者
* 没有要求每次调用供应商时都返回一个新的或不同的结果。
* 这个一个函数式接口，其函数式方法时get().
*/
@FunctionlInterface
public interface Supplier<T> {
  // Gets a result.
  // 返回值: a result
  T get();
}
```


#### Consumer消费型函数

`Consumer` 消费型函数和 `Supplier` 刚好相反。 `Consumer` 接收一个参数，没有返回值。

```java
/**
* 表示接受单个输入参数且不返回结果的操作。与大多数其它功能接口不同，Consumer预计通过副作用进行操作
* 这个一个功能接口，其功能式方法是accept(Object).
*/
@FunctionlInterface
public interface Consumer<T> {
  // 对给定参数执行此操作
  // 参数: t - 输入参数
  void accept(T t);

  /**
  * 返回一个组合的Consumer，它依次执行此操作和after操作。如果执行任一操作引发一场，则将其转发给组合操作的调用者。如果执行此操作抛出异常，则不会执行after操作
  * 参数： after 在此操作之后执行的操作
  * 返回值：一个组合的Consumer，它按顺序执行此操作，然后执行after操作
  */
  @Contract(pure = true) @NotNull
  default Consumer<T> andThen( @NotNull Consumer<? super T> after) {
    Objects.requireNonNull(after);
    return (T t) -> { accept(t); after.accept(t); };
  } 
}
```

#### Runnable无参无返回型函数

`Runnable` 的表现形式为即没有参数也没有返回值。

```java
/**
* Runnable接口应该由其实例旨在由线程执行的任何类实现。该类必须定义一个名为run的无参数方法。
* 此接口旨在为希望在活动时执行代码的对象提供通用协议。例如，Runnable是由类Thread实现的。处于活动状态仅意味线程已启动且尚未停止。
* 此外，Runnable提供了使类处于活动状态而不是子类化Thread。通过实例化Thread实例并将自身作为目标传入，实现Runnable的类可以在不继承Thread的情况下运行。在大多数情况下，如果您只打算覆盖run()方法而不打算覆盖其它Thread方法，则应该使用Runnable接口。这很重要，因为除非程序员打算修改或增强类的基本行为，否则类不应该被子类化。
*/
@FunctionlInterface
public interface Runnable {
  // 当使用实现接口Runnable的对象创建线程时，启动线程会导致在单独执行的线程中调用对象的run方法。
  // 方法run的一般约定是它可以采取任何行动。
  public abstract void run();
}
```

`Function`函数的表现形式为接收一个参数，并返回一个值。`Supplier`、`Consumer`和`Runnable`可以看作`Function`的一种特殊表现形式。

`lambda` 最简单和最普遍的情况是一个函数式接口，其方法接收一个值并返回另一个值。单个参数的函数由`Function`接口表示，该接口由其参数的类型和返回值进行参数化：

```java
public interface Function<T, R> { … }
```

标准库中`Function`类型的用法之一是`Map.computeIfAbsent`方法。此方法通过键从映射中返回一个值，但如果键不存在于映射中，则计算一个值。要计算一个值，它使用传递的 `Function` 实现：
```java
Map<String, Integer> nameMap = new HashMap<>();
Integer value = nameMap.computeIfAbsent("John", s -> s.length());
```

在这种情况下，我们将通过将函数应用于键来计算值，将其放入映射中，并从方法调用中返回。我们可以将lambda替换为匹配传递和返回值类型的方法引用。

请记住，我们调用方法的对象实际上是方法的隐式第一个参数。这允许我们将实例方法长度引用转换为`Function`接口：

```java
Integer value = nameMap.computeIfAbsent("John", String::length);
```

`Function`接口还有一个默认的`compose`方法，它允许我们将多个函数组合为一个并按顺序执行它们：

```java
Function<Integer, String> intToString = Object::toString;
Function<String, String> quote = s -> "'" + s + "'";

Function<Integer, String> quoteIntToString = quote.compose(intToString);

assertEquals("'5'", quoteIntToString.apply(5));
```

##### 处理抛出异常的if

1. 定义函数
定义一个抛出异常的形式的函数式接口，这个接口只有参数没有返回值是个消费型接口。

```java
/**
 * 抛异常接口
 **/
@FunctionalInterface
public interface ThrowExceptionFunction {

    /**
     * 抛出异常信息
     *
     * @param message 异常信息
     * @return void
     **/
    void throwMessage(String message);
}
```

2. 编写判断方法
创建工具类`VUtils`并创建一个`isTure`方法，方法的返回值为刚才定义的函数式接口-`ThrowExceptionFunction`。`ThrowExceptionFunction`的接口实现逻辑为当参数b为true时抛出异常

```java
/**
 *  如果参数为true抛出异常
 * 
 * @param b 
 * @return com.example.demo.func.ThrowExceptionFunction
 **/
public static ThrowExceptionFunction isTure(boolean b){

    return (errorMessage) -> {
        if (b){
            throw new RuntimeException(errorMessage);
        }
    };
}
```

3. 使用方式
调用工具类参数参数后，调用`函数式接口`的`throwMessage`方法传入异常信息。当出入的参数为`false`时正常执行。

```java
@Test
void isTure1() {
  VUtils.isTure(b:false).throwMessage('error!!!');
}
```

当出入的参数为true时抛出异常。

```java
@Test
void isTure1() {
  VUtils.isTure(b:true).throwMessage('is true,error!!!');
}
```

#### 处理if分支操作

1. 定义函数式接口
创建一个名为`BranchHandle`的函数式接口，接口的参数为两个`Runnable`接口。这两个两个`Runnable`接口分别代表了为`true`或`false`时要进行的操作

```java
/**
 * 分支处理接口
 **/
@FunctionalInterface
public interface BranchHandle {

    /**
     * 分支操作
     *
     * @param trueHandle 为true时要进行的操作
     * @param falseHandle 为false时要进行的操作
     * @return void
     **/
    void trueOrFalseHandle(Runnable trueHandle, Runnable falseHandle);

}
```

2. 编写判断方法
创建一个名为`isTureOrFalse`的方法，方法的返回值为刚才定义的函数式接口-`BranchHandle`。

```java
/**
 * 参数为true或false时，分别进行不同的操作 
 * 
 * @param b 
 * @return com.example.demo.func.BranchHandle     
 **/
public static BranchHandle isTureOrFalse(boolean b){
    
    return (trueHandle, falseHandle) -> {
        if (b){
            trueHandle.run();
        } else {
            falseHandle.run();
        }
    };
}
```

3. 使用方式
参数为`true`时，执行`trueHandle`。
参数为`false`时，执行`falseHandle`。

```java
@Test
void isTrueOrFalse() {
  VUtils.isTrueOrFalse(b:true)
    .trueOrFalseHandle(trueHandle:() -> {
      System.out.println("true, handle!!!");
    }, falseHandle:() -> {
      System.out.println("false, handle!!!");
    });
}
```

#### 如果存在值执行消费操作，否则执行基于空的操作

1. 定义函数
创建一个名为`PresentOrElseHandler`的函数式接口，接口的参数一个为`Consumer`接口。一个为`Runnable`,分别代表值不为空时执行消费操作和值为空时执行的其他操作

```java
/**
 * 空值与非空值分支处理
 */
public interface PresentOrElseHandler<T extends Object> {

    /**
     * 值不为空时执行消费操作
     * 值为空时执行其他的操作
     * 
     * @param action 值不为空时，执行的消费操作
     * @param emptyAction 值为空时，执行的操作
     * @return void    
     **/
   void presentOrElseHandle(Consumer<? super T> action, Runnable emptyAction);
   
}
```

2. 编写判断方法
创建一个名为`isBlankOrNoBlank`的方法，方法的返回值为刚才定义的函数式接口-`PresentOrElseHandler`。

```java
/**
 * 参数为true或false时，分别进行不同的操作
 *
 * @param b
 * @return com.example.demo.func.BranchHandle
 **/
public static PresentOrElseHandler<?> isBlankOrNoBlank(String str){

    return (consumer, runnable) -> {
        if (str == null || str.length() == 0){
            runnable.run();
        } else {
            consumer.accept(str);
        }
    };
}
```

3. 使用方式
调用工具类参数参数后，调用函数式接口的`presentOrElseHandle`方法传入一个`Consumer和Runnable`。

参数不为空时，打印参数。

```java
@Test
void isBlankOrNoBlank() {
  VUtils.isBlankOrNoBlank(str:"hello")
    .presentOrElseHandle(System.out::println, () -> {
      System.out.println("empty string!!!");
    });
}
```
