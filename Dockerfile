# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs
WORKDIR /src
COPY . .
RUN dotnet restore src/CNSPlus.Web/CNSPlus.Web.csproj
RUN dotnet publish src/CNSPlus.Web/CNSPlus.Web.csproj \
    -c Release -o /app /p:UseAppHost=false

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
# Phase 3: ship /content with the image so the PhysicalFileProvider can serve it
COPY --from=build /src/content /content
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
EXPOSE 8080
ENTRYPOINT ["dotnet", "CNSPlus.Web.dll"]
